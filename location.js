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

// Save location to LocalStorage
function saveLocation(name, latitude, longitude) {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    savedLocations.push({ name, latitude, longitude });
    localStorage.setItem('locations', JSON.stringify(savedLocations));
}

// Display saved locations
function displaySavedLocations() {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    locationsList.empty();

    savedLocations.forEach((location, index) => {
        const li = `
            <li class="list-group-item">
                <div class="d-flex justify-content-between align-items-center">
                    <div id="weather-${index}" class="mt-2"></div>
                    <button class="btn btn-danger btn-sm" onclick="deleteLocation(${index})">Delete</button>
                </div>
            </li>
        `;
        locationsList.append(li);

        // Fetch and display weather for each saved location
        const targetDiv = $(`#weather-${index}`);
        fetchWeather(location.latitude, location.longitude, targetDiv);
    });
}

// Delete location
function deleteLocation(index) {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    savedLocations.splice(index, 1);
    localStorage.setItem('locations', JSON.stringify(savedLocations));
    displaySavedLocations();
}