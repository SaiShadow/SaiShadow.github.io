function fetchUserLocationAndWeather() {
    if (!navigator.geolocation) {
        weatherDiv.html(getErrorDiv('Geolocation is not supported by your browser.'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            saveUserCoordinates(latitude, longitude); // Save user's coordinates
            displaySavedLocations(); // Load saved locations
            displayWeatherUser(latitude, longitude, weatherDiv); // Fetch weather for the location
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

// Fetch weather data for any location (reused function)
function displayWeatherUser(latitude, longitude, targetDiv) {

    let data = getWeatherData(latitude, longitude);
    if (data) {
        const weatherHTML = generateWeatherHTMLUser(data, latitude, longitude);
        targetDiv.html(weatherHTML); // Display weather data in the target div
    } else {
        targetDiv.html(getErrorDiv('Unable to fetch weather data. Please try again later.'));
    }
}

async function getWeatherData(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

function displaySavedLocationsInfo(latitude, longitude, targetDiv) {

    let data = getWeatherData(latitude, longitude);
    if (data) {
        const distance = getDistance(latitude, longitude);
        const infoHTML = generateInfoHTMLSavedLocations(data, latitude, longitude, distance);
        targetDiv.html(infoHTML);
    } else {
        targetDiv.html(getErrorDiv('Unable to fetch location data. Please try again later.'));
    }
}

function generateInfoHTMLSavedLocations(data, latitude, longitude) {
    const { name, weather, main } = data; // Extract weather details
    const iconCode = weather[0].icon; // Weather icon code
    return `
        <div class="weather-info-saved-locations">
            <h2>
                ${name || "Unknown Location"}
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}" class="weather-icon" />
                Distance:${getDistance(latitude, longitude)}
            </h2>
            <p><strong>Coordinates:</strong> ${latitude}, ${longitude}</p>
            <p><strong>Temperature:</strong> ${main.temp}°C</p>
            <p><strong>Condition:</strong> ${weather[0].description}</p>
        </div>
    `;
}


// Generate weather HTML
function generateWeatherHTMLUser(data, latitude, longitude) {
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
