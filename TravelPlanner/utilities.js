/**
 * Utilities
 * This file contains utility functions that are used across multiple files.
 */

// Personal API key for OpenWeatherMap API, please use your own key if you have one.
const apiKey = "db02b055afbb014b657f0e56aaabb7d1";

const weatherDiv = $('#weather');
const locationsList = $('#locations-list');
const tenMinutes = 10 * 60 * 1000;
const twentyMinutes = tenMinutes * 2;

// Global variable to store user's current coordinates
let userCoordinates = null;

/**
 * Save users current coordinates to session storage. 
 * Not local storage, as we don't need it to persist, and also bad for if user is on the move.
 * @param {*} latitude 
 * @param {*} longitude 
 */
function saveUserCoordinates(latitude, longitude) {
    userCoordinates = { latitude, longitude };
    sessionStorage.setItem('userCoordinates', JSON.stringify(userCoordinates));
}

/**
 * Generate error div with the given message.
 * @param {*} message 
 * @returns 
 */
function getErrorDiv(message) {
    return `<div class="alert alert-danger" role="alert">${message}</div>`;
}