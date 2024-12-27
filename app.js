// Import other modules (if using ES6 modules)
// Otherwise, ensure all scripts are loaded in the correct order in HTML
// better for just opening the browser by clicking the
$(document).ready(() => {
    fetchUserLocationAndWeather(); // Fetch current location weather
    displaySavedLocations();   // Load saved locations

    // Event listeners
    $('#add-location-button').on('click', addLocation);
    $('#location-name').on('keydown', (e) => {
        if (e.key === 'Enter') { // Handle Enter key
            e.preventDefault();
            addLocation();
        }
    });
});