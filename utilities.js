const apiKey = "db02b055afbb014b657f0e56aaabb7d1"; // API Key
const weatherDiv = $('#weather');
const locationsList = $('#locations-list');

// Generate reusable error message div
function getErrorDiv(message) {
    return `<div class="alert alert-danger" role="alert">${message}</div>`;
}