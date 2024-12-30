const canvas = document.getElementById("visualization-canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

// Initialize variables for panning and zooming
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
let scale = 1; // Zoom level

// Sizes
const minNodeSize = 20;
const maxNodeSize = 20;
const minFontSize = 30;
const maxFontSize = 30;

const minLineThickness = 10;
const maxLineThickness = 10;

let darkMode = false;

// Fetch saved locations from local storage
const savedLocations = JSON.parse(localStorage.getItem("locations")) || [];
// Fetch saved locations from session storage
const userCoordinates = JSON.parse(sessionStorage.getItem("userCoordinates"));


function drawNode(x, y, label, color = 'red') {

    // Calculate dynamic node size within min and max bounds
    const nodeSize = Math.min(Math.max(10 / scale, minNodeSize), maxNodeSize);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
    ctx.fill();

    // Calculate dynamic font size within min and max bounds
    let fontSize = Math.min(Math.max(12 / scale, minFontSize), maxFontSize);

    ctx.fillStyle = getFontColor(); // Font color
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(label, x + nodeSize + 5, y + 5);
}

function getFontColor() {
    if (darkMode) {
        return "white";
    }
    return "black";
}

function getLineColor(distance) {
    let color;

    if (distance < 50) {
        color = "green";
    } else if (distance < 200) {
        color = "orange";
    } else if (distance < 1000) {
        color = "red";
    } else {
        color = "purple";
    }

    return color;
}

function drawLine(x1, y1, x2, y2, distance) {
    let color = getLineColor(distance), //
        thickness = getLineThickness();

    ctx.strokeStyle = color;
    ctx.lineWidth = thickness; // Scale line thickness
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function getLineThickness() {
    return Math.min(Math.max(1 / scale, minLineThickness), maxLineThickness);
}

function calculateCanvasPosition(latitude, longitude) {
    const deltaLat = latitude - userCoordinates.latitude;
    const deltaLon = longitude - userCoordinates.longitude;

    const x = offsetX + deltaLon * 200 * scale; // Longitude affects horizontal placement
    const y = offsetY - deltaLat * 200 * scale; // Latitude affects vertical placement (negative is up)

    return {x, y};
}

function drawVisualization() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCardinalIndicators();

    if (!userCoordinates) {
        alert("Can't get the user coordinates. Please wait until Travel Planner finds your location.");
        return;
    }

    // Get user position on canvas
    const userPosition = calculateCanvasPosition(userCoordinates.latitude, userCoordinates.longitude);

    // Draw saved locations
    savedLocations.forEach((location) => {
        const position = calculateCanvasPosition(location.latitude, location.longitude);
        let distance = calculateDistance(userCoordinates.latitude, userCoordinates.longitude, location.latitude, location.longitude);
        drawLine(userPosition.x, userPosition.y, position.x, position.y, distance); // Line from user to location
        drawNode(position.x, position.y, location.name, "red");
    });

    // Draw user node on top of other lines
    drawNode(userPosition.x, userPosition.y, "You", "blue");
}

function drawCardinalIndicators() {
    ctx.fillStyle = getFontColor();
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