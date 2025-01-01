// Reference for map container and button
const mapContainer = document.getElementById("map-container");
const mapButton = document.getElementById("map-button");

// Reference to the Leaflet map instance
let map;

const defaultMapZoomLevel = 13;

/**
 * Initializes the map with the user's location and saved locations.
 *
 * This function creates and configures a Leaflet map instance if one does not already exist.
 * It displays the user's location with a marker and connects it to saved locations with
 * lines indicating distances. Each saved location is marked and labeled with a popup.
 */
function initializeMap() {

    if (!userCoordinates) {
        alert("Can't get the user coordinates. Please wait until Travel Planner finds your location.");
        return;
    }

    if (!map) {
        // Initialize the map
        map = L.map('map-container').setView([userCoordinates.latitude, userCoordinates.longitude], defaultMapZoomLevel);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add user's location marker
        L.marker([userCoordinates.latitude, userCoordinates.longitude])
            .addTo(map)
            .bindPopup("You are here")
            .openPopup();

        // Add saved locations and lines
        savedLocations.forEach(location => {
            const marker = L.marker([location.latitude, location.longitude])
                .addTo(map)
                .bindPopup(location.name);

            const distance = calculateDistance(userCoordinates.latitude, userCoordinates.longitude, location.latitude, location.longitude);

            // Draw a line from the user's location to the saved location
            L.polyline([[userCoordinates.latitude, userCoordinates.longitude], //
                [location.latitude, location.longitude]], //
                {color: getLineColor(distance)}) //
                .addTo(map);
        });
    }
}
