// Cache lifespan: 10 minutes, i.e.,
// fetch new weather data if the last fetch was more than 10 minutes ago.
const cacheValidityDuration = tenMinutes;

/**
 * To save on API calls, by saving weather data in session storage and retrieving them if
 * next call is within cacheValidityDuration, which is 10min.
 * @param latitude
 * @param longitude
 * @returns {Promise<*>} weather data
 */
async function getWeatherDataFromCache(latitude, longitude) {

    const cacheKey = `${latitude},${longitude}`;

    // Get cached data from session storage.
    const cachedData = JSON.parse(sessionStorage.getItem(cacheKey));

    if (cachedData && isDataStillValid(cachedData.timestamp)) {
        console.log(`Using cached data for ${latitude}, ${longitude}`);
        // Return cached data
        return cachedData.data;
    }

    // Fetch fresh data if the cached data is not valid
    console.log(`Fetching fresh weather data for ${latitude}, ${longitude}`);
    const data = await getWeatherData(latitude, longitude);
    if (data) {
        // Cache the fresh data
        sessionStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    }
    return data;
}

/**
 * Checks if the cached data is still valid based on the cacheValidityDuration.
 * @param {int} cachedDataTimestamp 
 * @returns {boolean} true if the data is still valid, false otherwise
 */
function isDataStillValid(cachedDataTimestamp) {
    return (Date.now() - cachedDataTimestamp) < cacheValidityDuration;
}