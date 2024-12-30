/**
 * @file location.js
 * This file contains functions for adding, deleting, and displaying saved locations.
 * It also contains the event listeners for the location input field and the canvas button.
 * The functions in this file are called from app.js.
 */

/**
 * Add location to the list of saved locations.
 * Gets location from input field, fetches coordinates using OpenWeatherMap Geocoding API,
 * then saves the location to LocalStorage, and displays the updated list of saved locations.
 * @returns
 */
async function addLocation() {
    const locationName = $('#location-name').val().trim();

    if (!locationName) {
        alert('Please enter a location name.');
        return;
    }

    const coordinates = await fetchCoordinates(locationName);
    if (coordinates) {
        saveLocation(coordinates.name, coordinates.latitude, coordinates.longitude);
        displaySavedLocations();
        // Clear the input field if the location was successfully added.
        $('#location-name').val('');
    }
}

/**
 * Fetch coordinates using OpenWeatherMap Geocoding API. Location name can also be short forms.
 * This functionality was added for user convenience, as searching for location names are better than coordinate-input.
 *
 * @param {*} locationName Can also be short forms like "NYC" for New York City, the API will return the first match.
 * @returns an object with the location name, latitude, and longitude.
 */
async function fetchCoordinates(locationName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length === 0) {
            alert('Location not found. Please try again.');
            return null;
        }

        const {name, lat, lon} = data[0];
        return {name: name, latitude: lat, longitude: lon};
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        alert('Unable to fetch location. Please try again.');
        return null;
    }
}

/**
 * Save location to LocalStorage
 * @param {*} name name of the location
 * @param {*} latitude latitude of the location
 * @param {*} longitude longitude of the location
 */
function saveLocation(name, latitude, longitude) {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    // Add new location to the beginning of the array
    savedLocations.unshift({name, latitude, longitude});
    localStorage.setItem('locations', JSON.stringify(savedLocations));
}

/**
 * Removes the "Visualize Locations" button if there are no saved locations.
 */
function turnOffCanvasButtonVisibility() {
    $('#open-canvas-btn').css('display', 'none');

}

/**
 * Turns on the "Visualize Locations" button if there are saved locations.
 */
function turnOnCanvasButtonVisibility() {
    $('#open-canvas-btn').css('display', 'inline-block');
}

/**
 * Display saved locations, refresh weather data everytime this function is called, (as long as the data is older than 10 minutes,)
 * so whenever a new location is added or deleted.
 */
function displaySavedLocations() {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    locationsList.empty();

    // If there are no saved locations, display a message, don't show "Visualize Locations" button and return.
    if (savedLocations.length === 0) {
        locationsList.html('<p class="text-muted">No saved locations. ' + 'Add a location to get started.</p>');
        turnOffCanvasButtonVisibility();
        return;
    } else {
        // If there are saved locations, show the "Visualize Locations" button.
        turnOnCanvasButtonVisibility();
    }

    let row = '<div class="row g-3">'; // Bootstrap row for grid layout

    savedLocations.forEach(async (location, index) => {
        const targetDivId = `weather-${index}`;
        row += `
            <div class="col-12 col-md-6 col-lg-4"> <!-- Adjust width dynamically -->
                <div class="location-card" id="${targetDivId}">
                </div>
            </div>
        `;
    });

    row += '</div>';
    locationsList.append(row);

    // Fetch and set inner html with weather data, distance and travel times for each saved location and display it.
    savedLocations.forEach(async (location, index) => {

        const targetDiv = $(`#weather-${index}`);
        const weatherData = await getWeatherDataFromCache(location.latitude, location.longitude);

        if (weatherData) {

            const distance = getDistance(location.latitude, location.longitude);
            const travelTimes = calculateTravelTimes(distance);

            const infoHTML = generateInfoHTMLSavedLocations(//
                weatherData,//
                location.latitude,//
                location.longitude,//
                distance,//
                travelTimes,//
                index//
            );
            targetDiv.html(infoHTML);

        } else {

            targetDiv.html(getErrorDiv('Unable to fetch location data. ' + //
                'Please try again later.'));
        }
    });
}

/**
 * Delete location from LocalStorage and display updated list of saved locations.
 * @param {*} index Index of the location to delete
 */
function deleteLocation(index) {
    deleteLocationFromStorage(index);
    displaySavedLocations();
}

/**
 * Delete location from LocalStorage.
 * @param {*} index
 */
function deleteLocationFromStorage(index) {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    savedLocations.splice(index, 1);
    localStorage.setItem('locations', JSON.stringify(savedLocations));
}