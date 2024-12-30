/**
 * Weather functions.
 * This file contains functions to fetch and display weather data.
 */

/**
 * Fetch user's current location and weather data. 
 * If location access is denied, an error message is displayed.
 * If location access is granted, the weather data is displayed.
 * If location access is granted, the saved locations are displayed
 * @returns 
 */
function fetchUserLocationAndWeather() {
    if (!navigator.geolocation) {
        weatherDiv.html(getErrorDiv('Geolocation is not supported by your browser.'));
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            // Save user's coordinates in session storage.
            saveUserCoordinates(latitude, longitude);

            // Fetch and display users weather card.
            await displayWeatherUser(latitude, longitude, weatherDiv);

            // Display saved locations again, now that we have the user's location.
            // Can calculate distance from user's location to saved locations. 
            // And calculate and display travel times.
            displaySavedLocations();

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

/**
 * Fetch weather data from the cache if it exists.
 * If the data is not in the cache or is expired, fetch it from the API.
 * Generate an inner HTML for the weather card and set it.
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} targetDiv 
 */
async function displayWeatherUser(latitude, longitude, targetDiv) {

    const data = await getWeatherDataFromCache(latitude, longitude);

    if (data) {
        const weatherHTML = generateWeatherHTMLUser(data, latitude, longitude);
        targetDiv.html(weatherHTML); // Display weather data in the target div

    } else {
        targetDiv.html(getErrorDiv('Unable to fetch weather data. Please try again later.'));
    }
}

/**
 * Fetch and display weather data cards for saved locations.
 * Similar to @displayWeatherUser, but for saved locations.
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} targetDiv 
 */
async function displaySavedLocationsInfo(latitude, longitude, targetDiv) {
    const data = await getWeatherDataFromCache(latitude, longitude);

    if (data) {
        // Calculate distance from user's location to saved location
        const distance = getDistance(latitude, longitude);

        const infoHTML = generateInfoHTMLSavedLocations(data, latitude, longitude, distance);

        // Display info for saved location in the target div
        targetDiv.html(infoHTML);

    } else {
        targetDiv.html(getErrorDiv('Unable to fetch location data. Please try again later.'));
    }
}

/**
 * Get weather data using OpenWeatherMap API.
 * It needs the latitude and longitude of the location.
 * Use Geocoding API to get the coordinates of a location.
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns weather data from API.
 */
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