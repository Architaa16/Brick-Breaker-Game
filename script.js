const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playButton = document.getElementById('playButton');
const gameOverDiv = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');

canvas.width = 480;
canvas.height = 320;

// Ball properties
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// Mouse control
let mouseX = 0;

// Brick properties
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
let score = 0;

// Create bricks
function createBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

createBricks();

// Event listener for mouse movement
document.addEventListener('mousemove', mouseMoveHandler, false);

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// Collision detection
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0; // Brick is hit, remove it
                    score += 10; // Increase score
                    checkAllBricksCleared(); // Check if all bricks are cleared
                }
            }
        }
    }
}

// Check if all bricks are cleared
function checkAllBricksCleared() {
    let allCleared = true;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                allCleared = false;
                break;
            }
        }
    }
    if (allCleared) {
        setTimeout(() => {
            spawnNewBricks(); // Spawn new set of blocks after all are cleared
        }, 1000);
    }
}

// Spawn new blocks
function spawnNewBricks() {
    createBricks(); // Reset the bricks
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Draw bricks
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Draw score
function drawScore() {
    scoreDisplay.textContent = score;
}

// Draw game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            endGame();
            return;
        }
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

// Start the game
function startGame() {
    playButton.style.display = 'none';
    canvas.style.display = 'block';
    gameOverDiv.style.display = 'none';
    createBricks(); // Reset bricks
    score = 0; // Reset score
    draw();
}

// End the game
function endGame() {
    gameOverDiv.style.display = 'block';
    finalScoreDisplay.textContent = score;
    canvas.style.display = 'none';
}

// Restart the game
function restartGame() {
    gameOverDiv.style.display = 'none';
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    createBricks(); // Recreate bricks
    score = 0; // Reset score
    startGame();
}

playButton.addEventListener('click', startGame);
