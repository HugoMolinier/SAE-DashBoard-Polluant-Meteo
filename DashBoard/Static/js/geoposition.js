/**
 * Get the user's location and update the map view to center on it.
*/
function getLocation() {
    try {
        // Try to get the user's location
        return navigator.geolocation.getCurrentPosition(updateWithPos);
    } catch (error) {
        // Handle any errors that occur based on the error code
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.log("An unknown error occurred.");
                break;
        }
    }
    return null;
}

/**
 * Set the view of the map to the specified coordinates.
 * @param {Object} position - The position object containing the coordinates.
 */
function updateWithPos(position) {
    mapsetView(position.coords.latitude, position.coords.longitude);
}