// Cache lifespan: 10 minutes
const cacheValidityDuration = tenMinutes;

/**
 * To save on API calls by saving weather data in session storage and retrieving them if
 * next call is within cacheValidityDuration, which 10min.
 * @param latitude
 * @param longitude
 * @returns {Promise<*>}
 */
async function getWeatherDataFromCache(latitude, longitude) {

    const cacheKey = `${latitude},${longitude}`;
    const cachedData = JSON.parse(sessionStorage.getItem(cacheKey));

    if (cachedData && isDataStillValid(cachedData.timestamp)) {

        console.log(`Using cached data for ${latitude}, ${longitude}`);
        // Return cached data
        return cachedData.data;
    }

    console.log(`Fetching fresh weather data for ${latitude}, ${longitude}`);
    const data = await getWeatherData(latitude, longitude);
    if (data) {
        sessionStorage.setItem(cacheKey, JSON.stringify({data, timestamp: Date.now()}));
    }
    return data;
}

function isDataStillValid(cachedDataTimestamp) {
    return (Date.now() - cachedDataTimestamp) < cacheValidityDuration;
}