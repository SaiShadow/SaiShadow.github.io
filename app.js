const apiKey = "db02b055afbb014b657f0e56aaabb7d1"; // From https://home.openweathermap.org/api_keys
const weatherDiv = $('#weather');

// Automatically fetch current location and weather on page load
$(document).ready(() => {
    fetchLocationAndWeather();
});

function fetchLocationAndWeather() {
    // Check if Geolocation is supported
    if (!navigator.geolocation) {
        weatherDiv.html(getErrorDiv('Geolocation is not supported by your browser.'));
        return;
    }

    // Fetch current location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(latitude, longitude); // Fetch weather for the location
        },
        (error) => {
            console.error("Geolocation error:", error);
            let errorMessage;

            // Optimized error messages based on Geolocation error codes
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