// Simple HTML5 Canvas Car Racing Game
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Game variables
    let carX = canvas.width / 2 - 15;
    let carY = canvas.height - 100;
    const carWidth = 30;
    const carHeight = 50;
    let speed = 5;
    let roadSpeed = 5;
    let score = 0;
    let gameOver = false;
    
    // Road variables
    const roadWidth = 300;
    const lineWidth = 10;
    const lineHeight = 50;
    let roadOffset = 0;
    
    // Controls
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        w: false,
        a: false,
        s: false,
        d: false
    };
    
    // Obstacles
    const obstacles = [];
    const obstacleWidth = 60;
    const obstacleHeight = 40;
    let obstacleTimer = 0;
    
    // Handle keyboard input
    window.addEventListener('keydown', function(e) {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
        }
    });
    
    window.addEventListener('keyup', function(e) {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
        }
    });
    
    // Add touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        const diffX = touchX - touchStartX;
        const diffY = touchY - touchStartY;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal movement
            if (diffX > 0) {
                keys.ArrowRight = true;
                keys.ArrowLeft = false;
            } else {
                keys.ArrowLeft = true;
                keys.ArrowRight = false;
            }
        } else {
            // Vertical movement
            if (diffY > 0) {
                keys.ArrowDown = true;
                keys.ArrowUp = false;
            } else {
                keys.ArrowUp = true;
                keys.ArrowDown = false;
            }
        }
        
        touchStartX = touchX;
        touchStartY = touchY;
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        keys.ArrowUp = false;
        keys.ArrowDown = false;
        keys.ArrowLeft = false;
        keys.ArrowRight = false;
    });
    
    // Game loop
    function gameLoop() {
        if (!gameOver) {
            update();
        }
        draw();
        requestAnimationFrame(gameLoop);
    }
    
    // Update game state
    function update() {
        // Move car based on input
        if ((keys.ArrowLeft || keys.a) && carX > (canvas.width - roadWidth) / 2) {
            carX -= speed;
        }
        if ((keys.ArrowRight || keys.d) && carX < (canvas.width + roadWidth) / 2 - carWidth) {
            carX += speed;
        }
        if ((keys.ArrowUp || keys.w) && carY > 0) {
            carY -= speed / 2;
            roadSpeed = 8;
        } else {
            roadSpeed = 5;
        }
        if ((keys.ArrowDown || keys.s) && carY < canvas.height - carHeight) {
            carY += speed / 2;
            roadSpeed = 3;
        }
        
        // Update road
        roadOffset = (roadOffset + roadSpeed) % lineHeight;
        
        // Update score
        score += roadSpeed / 10;
        
        // Generate obstacles
        obstacleTimer++;
        if (obstacleTimer > 60) {
            obstacleTimer = 0;
            const obstacleX = (canvas.width - roadWidth) / 2 + Math.random() * (roadWidth - obstacleWidth);
            obstacles.push({
                x: obstacleX,
                y: -obstacleHeight,
                width: obstacleWidth,
                height: obstacleHeight,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16)
            });
        }
        
        // Move obstacles
        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].y += roadSpeed;
            
            // Check collision
            if (
                carX < obstacles[i].x + obstacles[i].width &&
                carX + carWidth > obstacles[i].x &&
                carY < obstacles[i].y + obstacles[i].height &&
                carY + carHeight > obstacles[i].y
            ) {
                gameOver = true;
            }
            
            // Remove obstacles that are off-screen
            if (obstacles[i].y > canvas.height) {
                obstacles.splice(i, 1);
                i--;
            }
        }
    }
    
    // Draw game elements
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw road
        ctx.fillStyle = '#555';
        ctx.fillRect((canvas.width - roadWidth) / 2, 0, roadWidth, canvas.height);
        
        // Draw road lines
        ctx.fillStyle = '#fff';
        for (let i = -1; i < canvas.height / lineHeight + 1; i++) {
            ctx.fillRect(canvas.width / 2 - lineWidth / 2, i * lineHeight * 2 - roadOffset, lineWidth, lineHeight);
        }
        
        // Draw obstacles
        obstacles.forEach(obstacle => {
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // Draw car
        ctx.fillStyle = '#f00';
        ctx.fillRect(carX, carY, carWidth, carHeight);
        
        // Draw wheels
        ctx.fillStyle = '#000';
        ctx.fillRect(carX - 3, carY + 5, 3, 10);
        ctx.fillRect(carX - 3, carY + carHeight - 15, 3, 10);
        ctx.fillRect(carX + carWidth, carY + 5, 3, 10);
        ctx.fillRect(carX + carWidth, carY + carHeight - 15, 3, 10);
        
        // Draw score
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + Math.floor(score), 20, 30);
        
        // Draw game over message
        if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = '#fff';
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
            ctx.font = '20px Arial';
            ctx.fillText('Final Score: ' + Math.floor(score), canvas.width / 2, canvas.height / 2);
            ctx.fillText('Click or tap to play again', canvas.width / 2, canvas.height / 2 + 40);
            
            // Restart game on click or tap
            canvas.onclick = function() {
                carX = canvas.width / 2 - 15;
                carY = canvas.height - 100;
                obstacles.length = 0;
                score = 0;
                gameOver = false;
                canvas.onclick = null;
            };
        }
    }
    
    // Make canvas responsive
    function resizeCanvas() {
        const container = document.getElementById('gameContainer');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Maintain aspect ratio
        const aspectRatio = 4/3;
        let newWidth, newHeight;
        
        if (containerWidth / containerHeight > aspectRatio) {
            newHeight = containerHeight;
            newWidth = newHeight * aspectRatio;
        } else {
            newWidth = containerWidth;
            newHeight = newWidth / aspectRatio;
        }
        
        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Start game
    gameLoop();
});
