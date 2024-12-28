// Fetch current user location and weather
function fetchUserLocationAndWeather() {
    if (!navigator.geolocation) {
        weatherDiv.html(getErrorDiv('Geolocation is not supported by your browser.'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            saveUserCoordinates(latitude, longitude); // Save user's coordinates
            await displayWeatherUser(latitude, longitude, weatherDiv); // Fetch weather for the user's location
            displaySavedLocations(); // Load saved locations
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

// Fetch and display weather for user's location
async function displayWeatherUser(latitude, longitude, targetDiv) {
    const data = await getWeatherDataFromCache(latitude, longitude);
    if (data) {
        const weatherHTML = generateWeatherHTMLUser(data, latitude, longitude);
        targetDiv.html(weatherHTML); // Display weather data in the target div
    } else {
        targetDiv.html(getErrorDiv('Unable to fetch weather data. Please try again later.'));
    }
}

// Fetch and display weather for saved locations
async function displaySavedLocationsInfo(latitude, longitude, targetDiv) {
    const data = await getWeatherDataFromCache(latitude, longitude);
    if (data) {
        const distance = getDistance(latitude, longitude); // Calculate distance
        const infoHTML = generateInfoHTMLSavedLocations(data, latitude, longitude, distance);
        targetDiv.html(infoHTML); // Display info for saved location
    } else {
        targetDiv.html(getErrorDiv('Unable to fetch location data. Please try again later.'));
    }
}

// Get weather data using OpenWeatherMap API
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