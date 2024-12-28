// Average speed in km/h
const carSpeed = 70;
const cycleSpeed = 15;
const walkingSpeed = 5;

const carIcon = "bi bi-car-front";
const cycleIcon = "bi bi-bicycle";
const walkIcon = "bi bi-person-walking";

const travelModes = [//
    {mode: "Car", icon: carIcon, speed: carSpeed}, //
    {mode: "Cycle", icon: cycleIcon, speed: cycleSpeed}, //
    {mode: "Walk", icon: walkIcon, speed: walkingSpeed}, //
];

function calculateTravelTimes(distance) {
    return travelModes.map((mode) => {//
        const totalMinutes = (distance / mode.speed) * 60; // Convert hours to minutes
        const hours = Math.floor(totalMinutes / 60); //
        const minutes = Math.round(totalMinutes % 60); //
        return {
            mode: mode.mode,//
            icon: mode.icon,//
            time: hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`,//
        };
    });
}