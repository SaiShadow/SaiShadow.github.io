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
}

/**
 * Handle mouse down event
 */
function handleMouseDown(e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
}

/**
 * Handle mouse move event
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
 * Handle mouse up event
 */
function handleMouseUp() {
    isDragging = false;
}

/**
 * Handle touch start event
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
 * Handle touch move event
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
 * Handle touch end event
 */
function handleTouchEnd() {
    isDragging = false;

    // Reset pinch zoom state
    initialPinchDistance = null;
}

/**
 * Handle zoom event
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
 * Reset the view to the initial state
 */
function resetView() {
    offsetX = canvas.width / 2;
    offsetY = canvas.height / 2;
    scale = 1;
    drawVisualization();
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    darkMode = !darkMode;
    drawVisualization();
}