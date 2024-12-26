const apiKey = "db02b055afbb014b657f0e56aaabb7d1"; // From https://home.openweathermap.org/api_keys
const weatherDiv = $('#weather');
const locationsList = $('#locations-list'); // For saved locations

// Automatically fetch current location and weather on page load
$(document).ready(() => {
    fetchLocationAndWeather();
    displaySavedLocations(); // Load saved locations on page load
});

function fetchLocationAndWeather() {
    if (!navigator.geolocation) {
        weatherDiv.html(getErrorDiv('Geolocation is not supported by your browser.'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude); // Fetch weather for the location
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

// Generate error message divs (reusable)
function getErrorDiv(message) {
    return `<div class="alert alert-danger" role="alert">${message}</div>`;
}

// Fetch weather data using OpenWeatherMap API
async function fetchWeather(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        displayWeather(data, latitude, longitude); // Display weather data
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherDiv.html(getErrorDiv('Unable to fetch weather data. Please try again later.'));
    }
}

// Display weather data in the UI
function displayWeather(data, latitude, longitude) {
    const { name, weather, main } = data; // Extract weather details
    const iconCode = weather[0].icon; // Weather icon code
    const weatherHTML = `
        <div class="weather-info">
            <h2>
                ${name || "Unknown Location"}
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}" class="weather-icon" />
            </h2>
            <p><strong>Coordinates:</strong> ${latitude.toFixed(2)}, ${longitude.toFixed(2)}</p>
            <p><strong>Temperature:</strong> ${main.temp}°C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
        </div>
    `;
    weatherDiv.html(weatherHTML);
}

// Add event listener for Add Location button
$('#add-location-button').on('click', async () => {
    const locationName = $('#location-name').val().trim();

    if (!locationName) {
        alert('Please enter a location name.');
        return;
    }

    const coordinates = await fetchCoordinates(locationName);
    if (coordinates) {
        saveLocation(locationName, coordinates.latitude, coordinates.longitude);
        displaySavedLocations();
    }
});

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

    savedLocations.forEach(async (location, index) => {
        const weatherData = await fetchWeatherForLocation(location.latitude, location.longitude);
        const li = `<li class="list-group-item d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center">
                <strong>${location.name}</strong> (Lat: ${location.latitude.toFixed(2)}, Lon: ${location.longitude.toFixed(2)})
                <button class="btn btn-danger btn-sm" onclick="deleteLocation(${index})">Delete</button>
            </div>
            ${weatherData}
        </li>`;
        locationsList.append(li);
    });
}

// Delete location
function deleteLocation(index) {
    const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
    savedLocations.splice(index, 1);
    localStorage.setItem('locations', JSON.stringify(savedLocations));
    displaySavedLocations();
}

async function fetchWeatherForLocation(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            const { weather, main } = data;
            const iconCode = weather[0].icon;

            return `
                <div class="d-flex align-items-center mt-2">
                    <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}" class="weather-icon" />
                    <div>
                        <p class="mb-0"><strong>Temp:</strong> ${main.temp}°C</p>
                        <p class="mb-0"><strong>Condition:</strong> ${weather[0].description}</p>
                    </div>
                </div>
            `;
        } else {
            return `<p class="text-danger">Unable to fetch weather data.</p>`;
        }
    } catch (error) {
        console.error("Error fetching weather for saved location:", error);
        return `<p class="text-danger">Error fetching weather data.</p>`;
    }
}