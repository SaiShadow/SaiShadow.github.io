let userCoordinates = null; // Global variable to store user's current coordinates

// Save user's current coordinates
function saveUserCoordinates(latitude, longitude) {
    userCoordinates = { latitude, longitude };
}

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    // Earth's radius in kilometers
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Distance in kilometers
    return R * c;
}

// Display distance between user's location and a given location
function displayDistance(location) {
    const distance = getDistance(location.latitude, location.longitude);
    return `<p><strong>Distance:</strong> ${distance.toFixed(2)} km</p>`;
}

// Get distance between user's location and a given location
function getDistance(latitude, longitude){
    if (!userCoordinates) {
        return '';
    }
    const distance = calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        latitude,
        longitude
    );
    return distance.toFixed(2);
}