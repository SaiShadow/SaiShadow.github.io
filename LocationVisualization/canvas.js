/**
 * This file contains the code for the canvas and the visualization.
 * It also initializes the mouse, touch events, 
 * the zoom functionality, and button click handlers.
 */


$(document).ready(() => {
    initializeMouseEvents();
    initializeTouchEvents();
    initializeZoom();

    initializeButtons();

    // Draw the initial visualization
    drawVisualization();
});
