const canvas = document.getElementById('visualization-canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8;

// Fetch saved locations from localStorage
const savedLocations = JSON.parse(localStorage.getItem('locations')) || [];
const userCoordinates = JSON.parse(localStorage.getItem('userCoordinates')) || { latitude: 49.2243, longitude: 8.7221 };

function drawNode(x, y, label, color = 'red') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2); // Draw circle
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(label, x + 15, y + 5); // Add label
}

function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function calculateCircularPosition(index, totalLocations, centerX, centerY, radius) {
    const angle = (index / totalLocations) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
}

function drawVisualizationCircular() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) / 3; // Adjust radius dynamically

    // Draw user location at the center
    drawNode(centerX, centerY, 'You', 'blue');

    // Draw saved locations in a circular layout
    savedLocations.forEach((location, index) => {
        const { x, y } = calculateCircularPosition(index, savedLocations.length, centerX, centerY, radius);
        drawLine(centerX, centerY, x, y); // Line from user to location
        drawNode(x, y, location.name || 'Unnamed');
    });
}

function calculateCanvasPosition(latitude, longitude, canvasWidth, canvasHeight) {
    // Example normalization to map coordinates to canvas
    const x = canvasWidth / 2 + (longitude - userCoordinates.longitude) * 100;
    const y = canvasHeight / 2 - (latitude - userCoordinates.latitude) * 100;
    return { x, y };
}

function drawVisualization() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw user location at the center
    drawNode(centerX, centerY, 'You', 'blue');

    savedLocations.forEach((location, index) => {
        const { x, y } = calculateCircularPosition(index, savedLocations.length, centerX, centerY, radius);
        const distance = getDistance(location.latitude, location.longitude);
        drawLine(centerX, centerY, x, y, getColorBasedOnDistance(distance));
        drawNode(x, y, location.name, getColorBasedOnDistance(distance));
    });
}

function getColorBasedOnDistance(distance) {
    if (distance < 50) return 'green';
    if (distance < 200) return 'orange';
    return 'red';
}