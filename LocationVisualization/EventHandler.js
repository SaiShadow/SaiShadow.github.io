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
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);
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
    isDragging = true;
    const touch = e.touches[0];
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
}

/**
 * Handle touch move event
 */
function handleTouchMove(e) {
    if (isDragging) {
        const touch = e.touches[0];
        const dx = touch.clientX - dragStartX;
        const dy = touch.clientY - dragStartY;
        offsetX += dx;
        offsetY += dy;
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        drawVisualization();
    }
}

/**
 * Handle touch end event
 */
function handleTouchEnd() {
    isDragging = false;
}

/**
 * Handle zoom event
 */
function handleZoom(e) {
    e.preventDefault();
    const zoomFactor = 1.05; // Smaller value for finer zoom increments
    const zoom = e.deltaY > 0 ? 1 / zoomFactor : zoomFactor;
    const minScale = 0.5; // Minimum zoom level
    const maxScale = 5;   // Maximum zoom level

    // Apply zoom limits
    if (scale * zoom < minScale || scale * zoom > maxScale) {
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
}