
/**
 * Generate inner HTML dynamically for displaying the saved locations.
 * @param {*} data 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} distance 
 * @param {*} travelTimes 
 * @param {*} index 
 * @returns inner html string for each saved location.
 */
function generateInfoHTMLSavedLocations(data, latitude, longitude, distance, travelTimes, index) {
    const { name, weather } = data; // Extract weather details
    const iconCode = weather[0].icon; // Weather icon code
    return `
        <div class="weather-info-location">
            <!-- Left Section: Basic Info -->
            <section class="location-details">
                <h5 class="location-name">
                    <span>${name || "Unknown Location"}</span>
                    <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${weather[0].description}" class="weather-icon" />
                </h5>
                <p class="distance text-primary">${distance ? `Distance: ${distance} km` : ''}</p>
            </section>

            <!-- Right Section: Travel Times -->
            <section class="travel-times">
                <p><strong>Travel Times:</strong></p>
                <ul class="travel-time-list">
                    ${travelTimes
            .map(
                (mode) => `<li><i class="${mode.icon}"></i> ${mode.mode}: ${mode.time}</li>`
            )
            .join('')}
                </ul>
            </section>

            <!-- Delete Button -->            
            <button class="btn btn-danger btn-sm delete-btn" onclick="deleteLocation(${index})">
                Delete
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
}

/**
 * Generate inner HTML dynamically for displaying the user's current location weather card.
 * @param {*} data 
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns inner html string for the user's current location weather card.
 */
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