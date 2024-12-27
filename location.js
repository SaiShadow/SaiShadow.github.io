// Add location logic
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
        // Clear the input field if the location was successfully added
        $('#location-name').val('');
    }
}

// Fetch coordinates using OpenWeatherMap Geocoding API
async function fetchCoordinates(locationName) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length === 0) {
            alert('Location not found. Please try again.');
            return null;
        }

        const { lat, lon } = data[0];
        return { latitude: lat, longitude: lon };
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
    savedLocations.unshift({ name, latitude, longitude });
    localStorage.setItem('locations', JSON.stringify(savedLocations));
}

/**
 * Display saved locations, refresh weather data everytime this function is called,
 * so whenever a new location is added or deleted.
 */
function displaySavedLocations() {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    locationsList.empty();

    if (savedLocations.length === 0) {
        locationsList.html('<p class="text-muted">No saved locations. Add a location to get started.</p>');
        return;
    }

    let row = '<div class="row g-3">'; // Bootstrap row for grid layout

    savedLocations.forEach(async (location, index) => {
        const targetDivId = `weather-${index}`;
        row += `
            <div class="col-12 col-md-6 col-lg-4"> <!-- Adjust width dynamically -->
                <div class="location-card" id="${targetDivId}">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        `;
    });

    row += '</div>';
    locationsList.append(row);

    savedLocations.forEach(async (location, index) => {
        const targetDiv = $(`#weather-${index}`);
        const data = await getWeatherData(location.latitude, location.longitude);
        if (data) {
            const distance = getDistance(location.latitude, location.longitude);
            const travelTimes = calculateTravelTimes(distance);
            const infoHTML = generateInfoHTMLSavedLocations(data, location.latitude, location.longitude, distance, travelTimes, index);
            targetDiv.html(infoHTML);
        } else {
            targetDiv.html(getErrorDiv('Unable to fetch location data. Please try again later.'));
        }
    });
}
/**
 * Delete location from LocalStorage and display updated list of saved locations.
 * @param {*} index Index of the location to delete
 */
function deleteLocation(index) {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    savedLocations.splice(index, 1);
    localStorage.setItem('locations', JSON.stringify(savedLocations));
    displaySavedLocations();
}