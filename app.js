const apiKey = "db02b055afbb014b657f0e56aaabb7d1"; // API Key
const weatherDiv = $('#weather');
const locationsList = $('#locations-list');

// Automatically fetch current location and weather on page load
$(document).ready(() => {
    fetchLocationAndWeather();
    displaySavedLocations(); // Load saved locations on page load
    setupEnterKeyListener(); // Enable "Enter" key functionality
});

function fetchLocationAndWeather() {
    if (!navigator.geolocation) {
        weatherDiv.html(getErrorDiv('Geolocation is not supported by your browser.'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude, weatherDiv); // Fetch weather for the location
        },
        (error) => {
            console.error("Geolocation error:", error);
            let errorMessage;

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = "Location access denied by user.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    errorMessage = "The request to fetch location timed out.";
                    break;
                default:
                    errorMessage = "An unknown error occurred.";
            }

            weatherDiv.html(getErrorDiv(errorMessage));
        }
    );
}

// Generate reusable error message div
function getErrorDiv(message) {
    return `<div class="alert alert-danger" role="alert">${message}</div>`;
}

// Fetch weather data for any location (reused function)
async function fetchWeather(latitude, longitude, targetDiv) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const weatherHTML = generateWeatherHTML(data, latitude, longitude);
        targetDiv.html(weatherHTML); // Display weather data in the target div
    } catch (error) {
        console.error("Error fetching weather data:", error);
        targetDiv.html(getErrorDiv('Unable to fetch weather data. Please try again later.'));
    }
}

// Generate weather HTML
function generateWeatherHTML(data, latitude, longitude) {
    const { name, weather, main } = data; // Extract weather details
    const iconCode = weather[0].icon; // Weather icon code
    return `
        <div class="weather-info">
            <h2>
                ${name || "Unknown Location"}
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}" class="weather-icon" />
            </h2>
            <p><strong>Coordinates:</strong> ${latitude}, ${longitude}</p>
            <p><strong>Temperature:</strong> ${main.temp}°C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
        </div>
    `;
}

// Add event listener for Add Location button
$('#add-location-button').on('click', addLocation);

$('#location-name').on('keydown', (e) => {
    if (e.key === 'Enter') { // Check for the 'Enter' key
        e.preventDefault(); // Prevent default behavior
        addLocation(); // Call the addLocation function
    }
});


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
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${apiKey}`;
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