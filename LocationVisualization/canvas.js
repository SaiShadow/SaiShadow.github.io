$(document).ready(() => {

    canvas.addEventListener("mousedown", (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            offsetX += dx;
            offsetY += dy;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            drawVisualization();
        }
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

// Add touch support for dragging (mobile)
    canvas.addEventListener("touchstart", (e) => {
        isDragging = true;
        const touch = e.touches[0];
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
    });

    canvas.addEventListener("touchmove", (e) => {
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
    });

    canvas.addEventListener("touchend", () => {
        isDragging = false;
    });

// Add zoom functionality
// Add zoom functionality with adjusted sensitivity
    canvas.addEventListener("wheel", (e) => {
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

        // Adjust the offset so zoom is centered around the cursor
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        offsetX = mouseX - (mouseX - offsetX) * zoom;
        offsetY = mouseY - (mouseY - offsetY) * zoom;

        drawVisualization();
    });

    $("#dark-mode-button").on("click", toggleDarkMode);
    $("#reset-button").on("click", resetView);

// Draw the initial visualization
    drawVisualization();

});

function resetView() {
    offsetX = canvas.width / 2;
    offsetY = canvas.height / 2;
    scale = 1;
    drawVisualization();
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}