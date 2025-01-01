/**
 * Event handlers for mouse and touch events.
 */

let isDragging = false;
let dragStartX, dragStartY;
let initialPinchDistance = null;
let pinchStartScale = null;

const maxZoomOutScale = 0.01; // Allow much more zoom-out (0.1 for 10%)
const maxZoomInScale = 20; // Allow much more zoom-in (20x zoom)

/**
 * Initialize mouse events for dragging
 */
function initializeMouseEvents() {
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
}

/**
 * Initialize touch events for dragging (mobile)
 */
function initializeTouchEvents() {
    canvas.addEventListener("touchstart", handleTouchStart, {passive: false});
    canvas.addEventListener("touchmove", handleTouchMove, {passive: false});
    canvas.addEventListener("touchend", handleTouchEnd, {passive: false});
}

/**
 * Initialize zoom functionality
 */
function initializeZoom() {
    canvas.addEventListener("wheel", handleZoom);
}

/**
 * Initialize button click handlers
 */
function initializeButtons() {
    $("#dark-mode-button").on("click", toggleDarkMode);
    $("#reset-button").on("click", resetView);
    $("#map-button").on("click", handleOpenMapButtonClick);
}

/**
 * Handles the "mousedown" event to initiate dragging on the canvas.
 *
 * This function is triggered when the user presses the mouse button down on the canvas.
 * It sets the `isDragging` flag to `true` and records the starting position of the drag
 * (the mouse's `clientX` and `clientY` coordinates). These values are used to calculate
 * movement during the drag.
 *
 */
function handleMouseDown(e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
}

/**
 * Handles the "mousemove" event to drag the canvas while the mouse is held down.
 *
 * This function calculates the difference in mouse position during a drag and updates
 * the canvas offset accordingly. It redraws the visualization to reflect the new position.
 */
function handleMouseMove(e) {
    e.preventDefault(); // Prevent browser scrolling
    if (isDragging) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        offsetX += dx;
        offsetY += dy;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        drawVisualization();
    }
}

/**
 * Handles the "mouseup" event to stop dragging the canvas.
 *
 * This function is triggered when the mouse button is released, disabling the dragging state.
 */
function handleMouseUp() {
    isDragging = false;
}

/**
 * Handles the "touchstart" event to initiate dragging or pinch zooming on the canvas.
 *
 * This function differentiates between single-touch and two-touch gestures:
 * - A single touch initiates dragging by setting the starting position.
 * - Two touches initiate pinch zooming by calculating the initial distance between the touches
 *   and disabling dragging during the gesture.
 */
function handleTouchStart(e) {
    // Distinct behavior for single and double touch, important for pinch zoom on mobile.
    if (e.touches.length === 1) {
        // Single touch: drag start
        isDragging = true;
        const touch = e.touches[0];
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;

    } else if (e.touches.length === 2) {
        // Two touches: pinch zoom start
        // Disable dragging during pinch zoom
        isDragging = false;
        initialPinchDistance = getPinchDistance(e.touches);
        pinchStartScale = scale;
    }
}

/**
 * Handles the "touchmove" event to support dragging and pinch zooming on the canvas.
 *
 * This function enables dragging with a single touch and pinch zooming with two touches.
 * It recalculates the canvas position or scale based on the user's gestures and redraws
 * the visualization accordingly.
 */
function handleTouchMove(e) {
    e.preventDefault(); // Prevent browser scrolling
    if (e.touches.length === 1 && isDragging) {
        // Single touch: drag
        const touch = e.touches[0];
        const dx = touch.clientX - dragStartX;
        const dy = touch.clientY - dragStartY;
        offsetX += dx;
        offsetY += dy;
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        drawVisualization();
    } else if (e.touches.length === 2) {
        // Two touches: pinch zoom
        const pinchDistance = getPinchDistance(e.touches);
        const zoom = pinchDistance / initialPinchDistance;

        scale = Math.min(Math.max(pinchStartScale * zoom, maxZoomOutScale), // Minimum zoom level
            maxZoomInScale // Maximum zoom level
        );
        drawVisualization();
    }
}

/**
 * Handles the "touchend" event to end dragging or pinch zooming on the canvas.
 *
 * This function is triggered when the user lifts their finger(s) from the canvas.
 * It disables the dragging state and resets the pinch zoom state if applicable.
 */
function handleTouchEnd() {
    isDragging = false;

    // Reset pinch zoom state
    initialPinchDistance = null;
}

/**
 * Handles the "wheel" event to perform zooming on the canvas.
 *
 * This function adjusts the zoom level based on the user's scroll direction.
 * It ensures zoom limits are respected and recalculates the canvas offset to
 * center the zoom around the mouse cursor for a smooth and intuitive experience.
 */
function handleZoom(e) {
    e.preventDefault();

    // Smaller value for finer zoom increments
    const zoomFactor = 1.05;
    const zoom = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor;

    // Apply zoom limits
    if (scale * zoom < maxZoomOutScale || scale * zoom > maxZoomInScale) {
        return;
    }

    scale *= zoom;

    // Adjust the offset so zooming is centered around the cursor
    const mouseX = e.clientX - canvas.getBoundingClientRect().left;
    const mouseY = e.clientY - canvas.getBoundingClientRect().top;

    offsetX = mouseX - (mouseX - offsetX) * zoom;
    offsetY = mouseY - (mouseY - offsetY) * zoom;

    drawVisualization();
}

/**
 * Get the distance between two touch points
 */
function getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Reset the view of the map/canvas to the initial state
 */
function resetView() {
    const isMapVisible = isMapOpen();

    if (isMapVisible) {
        // Reset map view to the default center and zoom level
        if (map) {
            map.setView([userCoordinates.latitude, userCoordinates.longitude], defaultMapZoomLevel);
        }
    } else {
        // Reset canvas view
        offsetX = canvas.width / 2;
        offsetY = canvas.height / 2;
        scale = 1;
        drawVisualization();
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    darkMode = !darkMode;
    drawVisualization();
}

/**
 * Handles the "Open Map" button click event to toggle between the map and canvas views.
 *
 * This function toggles the visibility of the map (`#map-container`) and canvas (`.canvas-container`)
 * when the "Open Map" or "Open Graph" button is clicked. It switches the views and updates the button's
 * icon and text accordingly.
 *
 * Behavior:
 * - If the map view is visible:
 *   - Hides the map container.
 *   - Displays the canvas container.
 *   - Updates the button text and icon to "Open Map."
 *   - Destroys the existing map instance to conserve resources.
 *
 * - If the map view is not visible:
 *   - Displays the map container.
 *   - Hides the canvas container.
 *   - Updates the button text and icon to "Open Graph."
 *   - Initializes the map view.
 */
function handleOpenMapButtonClick() {
    const isMapVisible = isMapOpen();

    if (isMapVisible) {
        // Hide the map and show the canvas
        mapContainer.style.display = "none";
        document.querySelector(".canvas-container").style.display = "block";
        mapButton.innerHTML = `<i class="bi bi-map-fill"></i> Open Map`;

        // Destroy map instance to save resources
        if (map) {
            map.remove();
            map = null;
        }
    } else {
        // Show the map and hide the canvas
        mapContainer.style.display = "block";
        document.querySelector(".canvas-container").style.display = "none";
        mapButton.innerHTML = `<i class="bi bi-graph-up"></i> Open Graph`;

        // Initialize the map
        initializeMap();
    }
}

/**
 * Checks if the map view is currently visible.
 *
 * This function determines whether the map container (`#map-container`)
 * is currently displayed. It returns `true` if the map view is visible,
 * and `false` otherwise.
 *
 * @returns {boolean} `true` if the map container is visible (`display: block`),
 *                    otherwise `false`.
 */
function isMapOpen() {
    return mapContainer.style.display === "block";
}