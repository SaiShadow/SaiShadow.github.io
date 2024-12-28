// Import other modules (if using ES6 modules)
// Otherwise, ensure all scripts are loaded in the correct order in HTML
// better for just opening the browser by clicking the index.html file instead
// of starting a server
$(document).ready(() => {
    initializeApp(); // Initialize the application
});

/**
 * Initialize the application
 */
function initializeApp() {
    fetchUserLocationAndWeather(); // Fetch current location weather
    displaySavedLocations(); // Load saved locations

    // Initialize event listeners
    initializeLocationInputEvents();
    initializeCanvasButtonEvent();
}

/**
 * Initialize event listeners for location input
 */
function initializeLocationInputEvents() {
    $('#add-location-button').on('click', handleAddLocationButtonClick);
    $('#location-name').on('keydown', handleLocationNameKeydown);
}

/**
 * Initialize event listener for opening the canvas
 */
function initializeCanvasButtonEvent() {
    $('#open-canvas-btn').on('click', handleOpenCanvasButtonClick);
}

/**
 * Handle click event for the "Add Location" button
 */
function handleAddLocationButtonClick() {
    addLocation().catch((error) => {
        console.error("Error adding location:", error);
    });
}

/**
 * Handle keydown event for the location name input field.
 */
function handleLocationNameKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addLocation().catch((error) => {
            console.error("Error adding location:", error);
        });
    }
}

/**
 * Handle click event for the "Open Canvas" button
 */
function handleOpenCanvasButtonClick() {
    window.open('LocationVisualization/visualization.html', '_blank');
}