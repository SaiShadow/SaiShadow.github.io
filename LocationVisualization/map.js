// Reference for map container and button
const mapContainer = document.getElementById("map-container");
const mapButton = document.getElementById("map-button");

let map; // Reference to the Leaflet map instance

const defaultMapZoomLevel = 13;

/**
 * Initialize the map with user and saved locations
 */
function initializeMap() {
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
                .bindPopup(location.name)

            const distance = calculateDistance(userCoordinates.latitude, userCoordinates.longitude, location.latitude, location.longitude);

            // Draw a line from the user's location to the saved location
            L.polyline([[userCoordinates.latitude, userCoordinates.longitude], //
                [location.latitude, location.longitude]], //
                {color: getLineColor(distance)}) //
                .addTo(map);
        });
    }
}
