/**
 * This file contains the code for the canvas and the visualization.
 */
/**
 * This canvas-based map visualization was part of an earlier implementation before I discovered map APIs like
 * OpenStreetMap from a friend.
 *
 * While OpenStreetMap offers extensive real-world map data and features, this canvas implementation was designed
 * from scratch to provide a smooth and highly customizable experience.
 *
 * Given the significant effort and time invested in implementing the canvas visualization, including features
 * like panning, zooming, and dynamic rendering, it felt impractical to discard it entirely.
 * Instead, I decided to retain it as an additional feature to complement the OpenStreetMap-based view,
 * offering users a lightweight and interactive alternative.
 */

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

// Needed for changing fonts and background colors based on dark mode.
let darkMode = false;

// Fetch saved locations from local storage
const savedLocations = JSON.parse(localStorage.getItem("locations")) || [];

// Fetch user coordinates from session storage
const userCoordinates = JSON.parse(sessionStorage.getItem("userCoordinates"));

/**
 * Draw a node on the canvas, with the given coordinates, label/name, and color.
 * @param {*} x
 * @param {*} y
 * @param {*} label
 * @param {*} color
 */
function drawNode(x, y, label, color = 'red') {

    // Calculate dynamic node size within min and max bounds
    const nodeSize = Math.min(Math.max(10 / scale, minNodeSize), maxNodeSize);

    // Circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
    ctx.fill();

    // Calculate dynamic font size within min and max bounds
    let fontSize = Math.min(Math.max(12 / scale, minFontSize), maxFontSize);

    ctx.fillStyle = getFontColor();
    ctx.font = `${fontSize}px Arial`;
    ctx.fillText(label, x + nodeSize + 5, y + 5);
}

/**
 * Get the font color based on dark mode.
 * @returns
 */
function getFontColor() {
    if (darkMode) {
        return "white";
    }
    return "black";
}

/**
 * Get the line color based on the distance.
 * Rules written in the Legend.
 * @param {*} distance
 * @returns
 */
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

/**
 * Draw a line between two points on the canvas.
 * Gets line color based on distance.
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @param {*} distance
 */
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

/**
 * Calculate where the coordinates should be placed on the canvas.
 *
 * @param {*} latitude
 * @param {*} longitude
 * @returns
 */
function calculateCanvasPosition(latitude, longitude) {
    const deltaLat = latitude - userCoordinates.latitude;
    const deltaLon = longitude - userCoordinates.longitude;

    const x = offsetX + deltaLon * 200 * scale; // Longitude affects horizontal placement
    const y = offsetY - deltaLat * 200 * scale; // Latitude affects vertical placement (negative is up)

    return {x, y};
}

/**
 * Main function to draw the visualization on the canvas.
 * Draws user node, saved locations, and lines between them.
 * Handles zoom and pan.
 * Handles dark mode.
 *
 * @returns
 */
function drawVisualization() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // N, S, E, W on the canvas
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

/**
 * Draw the cardinal indicators on the canvas.
 */
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