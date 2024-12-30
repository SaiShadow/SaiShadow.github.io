/**
 * Travel Times.
 * Calculate average travel times for different modes of transport.
 */

// Average speed in km/h
const carSpeed = 70;
const cycleSpeed = 15;
const walkingSpeed = 5;

// Icons for different modes of transport from Bootstrap Icons.
const carIcon = "bi bi-car-front";
const cycleIcon = "bi bi-bicycle";
const walkIcon = "bi bi-person-walking";

// Array of travel modes with their respective speed and icons.
const travelModes = [//
    {mode: "Car", icon: carIcon, speed: carSpeed}, //
    {mode: "Cycle", icon: cycleIcon, speed: cycleSpeed}, //
    {mode: "Walk", icon: walkIcon, speed: walkingSpeed}, //
];

/**
 * Calculate travel times for different modes of transport.
 * Display travel times in hours and minutes.
 * But only display hours if the travel time is more than 1 hour.
 * Only display minutes if the travel time is less than 1 hour.
 * @param {*} distance
 * @returns
 */
function calculateTravelTimes(distance) {
    return travelModes.map((mode) => {//
        const totalMinutes = (distance / mode.speed) * 60; // Convert hours to minutes
        const hours = Math.floor(totalMinutes / 60); //
        const minutes = Math.round(totalMinutes % 60); //
        return {
            mode: mode.mode,//
            icon: mode.icon,//

            // Display hours and minutes, if the travel time is more than 1 hour.
            // Only display minutes if the travel time is less than 1 hour.
            time: hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`,//
        };
    });
}