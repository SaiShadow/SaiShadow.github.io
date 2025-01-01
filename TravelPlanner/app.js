// Import other modules (if using ES6 modules) but not needed for this project.
// Ensure all scripts are loaded in the correct order in HTML.
// This option is better for just opening the browser by clicking the index.html file instead
// of starting a server.
$(document).ready(() => {
    // Initialize the application when the document is ready.
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Fetch users current location and weather
    fetchUserLocationAndWeather();

    // Display the saved locations (saved by user, found in local storage)
    displaySavedLocations();

    // Initialize event listeners
    initializeLocationInputEvents();
    initializeCanvasButtonEvent();
}

/**
 * Initialize event listeners for location input
 */
function initializeLocationInputEvents() {
    $("#add-location-button").on("click", handleAddLocationButtonClick);
    $("#location-name").on("keydown", handleLocationNameKeydown);
}

/**
 * Initialize event listener for opening the canvas.
 */
function initializeCanvasButtonEvent() {
    $("#open-canvas-btn").on("click", handleOpenCanvasButtonClick);
}

/**
 * Handle click event for the "Add Location" button
 * Add the location currently in the input bar to the list of saved locations.
 */
function handleAddLocationButtonClick() {
    addLocation().catch((error) => {
        console.error("Error adding location:", error);
    });
}

/**
 * Handle keydown event for the location name input field.
 * If the user presses Enter, add the location.
 */
function handleLocationNameKeydown(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        addLocation().catch((error) => {
            console.error("Error adding location:", error);
        });
    }
}

/**
 * Handle click event for the "Open Canvas" button.
 * Opens the location visualization in a new tab.
 */
function handleOpenCanvasButtonClick() {
    window.open("LocationVisualization/visualization.html", "_blank");
}
