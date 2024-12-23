const getLocationButton = document.getElementById("getLocation");
const weatherDiv = document.getElementById("weather");

getLocationButton.addEventListener("click", () => {
    // Show loading feedback
    weatherDiv.innerHTML = "<p>Fetching your location and weather details...</p>";

    // Check if Geolocation is supported
    if (!navigator.geolocation) {
        weatherDiv.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
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
            weatherDiv.innerHTML = "<p>Unable to fetch your location. Please try again.</p>";
        }
    );
});

// Fetch weather data using OpenWeatherMap API
async function fetchWeather(latitude, longitude) {
    const apiKey = "db02b055afbb014b657f0e56aaabb7d1"; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayWeather(data, latitude, longitude); // Display weather data
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherDiv.innerHTML = "<p>Unable to fetch weather data. Please try again later.</p>";
    }
}

// Display weather data in the UI
function displayWeather(data, latitude, longitude) {
    const { name, weather, main } = data; // Extract weather details
    const weatherHTML = `
        <div class="weather-info">
            <h2>${name || "Unknown Location"}</h2>
            <p><strong>Coordinates:</strong> ${latitude.toFixed(2)}, ${longitude.toFixed(2)}</p>
            <p><strong>Temperature:</strong> ${main.temp}°C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
        </div>
    `;
    weatherDiv.innerHTML = weatherHTML;
}