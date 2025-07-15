// Standalone location request script
(function() {
  // Force location request on page load
  window.addEventListener('load', function() {
    setTimeout(requestLocation, 1000);
  });

  // Also try immediately
  requestLocation();

  function requestLocation() {
    console.log("Attempting to request location permission...");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          console.log("✅ LOCATION PERMISSION GRANTED!");
          console.log("Latitude:", position.coords.latitude);
          console.log("Longitude:", position.coords.longitude);
          console.log("Accuracy:", position.coords.accuracy + " meters");
          
          // Create visual indicator that location is working
          var indicator = document.createElement('div');
          indicator.style.position = 'fixed';
          indicator.style.bottom = '10px';
          indicator.style.right = '10px';
          indicator.style.background = 'green';
          indicator.style.color = 'white';
          indicator.style.padding = '5px 10px';
          indicator.style.borderRadius = '5px';
          indicator.style.zIndex = '9999';
          indicator.textContent = 'Location: ' + 
            position.coords.latitude.toFixed(4) + ', ' + 
            position.coords.longitude.toFixed(4);
          document.body.appendChild(indicator);
        },
        function(error) {
          console.error("❌ LOCATION ERROR:", error.message);
          console.error("Error code:", error.code);
          
          // Create visual error indicator
          var indicator = document.createElement('div');
          indicator.style.position = 'fixed';
          indicator.style.bottom = '10px';
          indicator.style.right = '10px';
          indicator.style.background = 'red';
          indicator.style.color = 'white';
          indicator.style.padding = '5px 10px';
          indicator.style.borderRadius = '5px';
          indicator.style.zIndex = '9999';
          indicator.textContent = 'Location error: ' + error.message;
          document.body.appendChild(indicator);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      alert("Geolocation is not supported by this browser");
    }
  }
})();
