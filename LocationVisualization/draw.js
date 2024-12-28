const canvas = document.getElementById("visualization-canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

// Initialize variables for panning and zooming
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
let scale = 1; // Zoom level
let isDragging = false;
let dragStartX, dragStartY;

// Fetch saved locations from localStorage
const savedLocations = JSON.parse(localStorage.getItem("locations")) || [];
const userCoordinates = JSON.parse(sessionStorage.getItem("userCoordinates"));

function drawNode(x, y, label, color = 'red') {
    const nodeSize = Math.max(10 * scale, 2); // Adjust node size with a minimum threshold
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, nodeSize, 0, Math.PI * 2); // Draw circle with dynamic size
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = `${Math.max(12 * scale, 6)}px Arial`; // Adjust font size with a minimum threshold
    ctx.fillText(label, x + nodeSize + 5, y + 5); // Add label with dynamic positioning
}

function drawLine(x1, y1, x2, y2, distance) {
    let color, //
        thickness = 1.5 * scale;
    if (distance < 100) {
        color = "green";
        // thickness = 2 * scale;
    } else if (distance < 500) {
        color = "orange";
        // thickness = 1.5 * scale;
    } else {
        color = "red";
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(thickness, 1 / scale); // Scale line thickness
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function calculateCanvasPosition(latitude, longitude) {
    const deltaLat = latitude - userCoordinates.latitude;
    const deltaLon = longitude - userCoordinates.longitude;

    const x = offsetX + deltaLon * 100 * scale; // Longitude affects horizontal placement
    const y = offsetY - deltaLat * 100 * scale; // Latitude affects vertical placement

    return {x, y};
}

function drawVisualization() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCardinalIndicators();

    if (!userCoordinates) {
        alert("Can't get the user coordinates. Please wait until Travel Planner finds your location.");
        return;
    }

    // Draw user location
    const userPosition = calculateCanvasPosition(userCoordinates.latitude, userCoordinates.longitude);
    drawNode(userPosition.x, userPosition.y, "You", "blue");

    // Draw saved locations
    savedLocations.forEach((location) => {
        const position = calculateCanvasPosition(location.latitude, location.longitude);
        let distance = calculateDistance(userCoordinates.latitude, userCoordinates.longitude, location.latitude, location.longitude);
        drawLine(userPosition.x, userPosition.y, position.x, position.y, distance); // Line from user to location
        drawNode(position.x, position.y, location.name, "red");
    });
}

function drawCardinalIndicators() {
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';

    // North
    ctx.fillText('N', canvas.width / 2 - 5, 20); // Adjusted to center text horizontally

    // South
    ctx.fillText('S', canvas.width / 2 - 5, canvas.height - 10); // Near the bottom of the canvas

    // East
    ctx.fillText('E', canvas.width - 20, canvas.height / 2 + 5); // Near the right edge

    // West
    ctx.fillText('W', 10, canvas.height / 2 + 5); // Near the left edge

}