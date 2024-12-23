const apiKey = "db02b055afbb014b657f0e56aaabb7d1"; // From https://home.openweathermap.org/api_keys
const weatherDiv = $('#weather');


// Automatically fetch current location and weather on page load
$(document).ready(() => {
    fetchLocationAndWeather();
});

function fetchLocationAndWeather() {
    // Show loading spinner
    weatherDiv.html('<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>');

    // Check if Geolocation is supported
    if (!navigator.geolocation) {
        weatherDiv.html('<div class="alert alert-danger" role="alert">Geolocation is not supported by your browser.</div>');
        return;
    }

    // Fetch current location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude); // Fetch weather for the location
        },
        (error) => {
            console.error(error);
            weatherDiv.html('<div class="alert alert-danger" role="alert">Unable to fetch your location. Please try again.</div>');
        }
    );
}

// Fetch weather data using OpenWeatherMap API
async function fetchWeather(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data, latitude, longitude); // Display weather data
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherDiv.html('<div class="alert alert-danger" role="alert">Unable to fetch weather data. Please try again later.</div>');
    }
}

// Display weather data in the UI
function displayWeather(data, latitude, longitude) {
    const { name, weather, main } = data; // Extract weather details
    const iconCode = weather[0].icon; // Weather icon code
    const weatherHTML = `
        <div class="weather-info">
            <h2>${name || "Unknown Location"}
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}" class="weather-icon" /></h2>
            <p><strong>Coordinates:</strong> ${latitude.toFixed(2)}, ${longitude.toFixed(2)}</p>
            <p><strong>Temperature:</strong> ${main.temp}°C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
        </div>
    `;
    weatherDiv.html(weatherHTML);
}