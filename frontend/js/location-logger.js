javascript
// Simple location logger
function logUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location access granted!");
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
        // Location data is now available in the console
      },
      (error) => {
        console.error("Location access denied:", error.message);
      }
    );
  } else {
    console.error("Geolocation not supported");
  }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', logUserLocation);
