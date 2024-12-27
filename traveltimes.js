const travelModes = [
    { mode: "Car", icon: "bi bi-car-front", speed: 80 },
    { mode: "Walking", icon: "bi bi-person-walking", speed: 5 },
    { mode: "Cycle", icon: "bi bi-bicycle", speed: 15 },
];

function calculateTravelTimes(distance) {
    return travelModes.map((mode) => {
        const totalMinutes = (distance / mode.speed) * 60; // Convert hours to minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return {
            mode: mode.mode,
            icon: mode.icon,
            time: hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`,
        };
    });
}