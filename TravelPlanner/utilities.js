const apiKey = "db02b055afbb014b657f0e56aaabb7d1"; // API Key
const weatherDiv = $('#weather');
const locationsList = $('#locations-list');
const tenMinutes = 10 * 60 * 1000;
const twentyMinutes = tenMinutes * 2;

let userCoordinates = null; // Global variable to store user's current coordinates

// Save user's current coordinates
function saveUserCoordinates(latitude, longitude) {
    userCoordinates = { latitude, longitude };
    sessionStorage.setItem('userCoordinates', JSON.stringify(userCoordinates));
}


// Generate reusable error message div
function getErrorDiv(message) {
    return `<div class="alert alert-danger" role="alert">${message}</div>`;
}