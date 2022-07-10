const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

//paddle

const paddle = {
	x: canvas.width / 2 - 40,
	y: canvas.height - 20,
	w: 80,
	h: 10,
	speed: 8,
	dx: 0,
};
//brick
const brickInfo = {
	w: 70,
	h: 20,
	padding: 10,
	offsetX: 45,
	offsetY: 60,
	visible: true,
};
//array brick - loop
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
	bricks[i] = [];
	for (let j = 0; j < brickRowCount; j++) {
		const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
		const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
		bricks[i][j] = { x, y, ...brickInfo };
	}
}
//ball
const ball = {
	x: canvas.width / 2,
	y: canvas.height / 1.5,
	size: 10,
	speed: 4,
	dx: 4,
	dy: -4,
};
//draw ball
function drawBall() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
	ctx.fillStyle = '#0095dd';
	ctx.fill();
	ctx.closePath();
}

//draw paddle
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
	ctx.fillStyle = '#0095dd';
	ctx.fill();
	ctx.closePath();
}
//draw score
function drawScore() {
	ctx.font = '20px Arial';
	ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}
// draw bricks
function drawBricks() {
	bricks.forEach((column) => {
		column.forEach((brick) => {
			ctx.beginPath();
			ctx.rect(brick.x, brick.y, brick.w, brick.h);
			ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
			ctx.fill();
			ctx.closePath();
		});
	});
}

//move paddle
function movePaddle() {
	paddle.x += paddle.dx;

	//end canvas
	if (paddle.x + paddle.w > canvas.width){
		paddle.x = canvas.width - paddle.w;
	}
	if (paddle.x < 0) {
		paddle.x = 0;
	}
}

//draw everything
function draw() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawBall();
	drawPaddle();
	drawScore();
	drawBricks();
}

function update() {
	movePaddle();
    moveBall();

	//draw everything
	draw();

	requestAnimationFrame(update);
}
update();

//Key event
function keyDown(e) {
	if (e.key === 'Right' || e.key === 'ArrowRight') {
		paddle.dx = paddle.speed;
	} else if (e.key === 'Left' || 'ArrowLeft') {
		paddle.dx = -paddle.speed;
	}
    
}
function keyUp(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
    
}

//move ball
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
//end canvas rigth/left
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1; 
    }
 // end canvas top/down   
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
        ball.dy *= -1; 
    }
//paddle contra ball
    if(ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y){
        ball.dy = -ball.speed;
    }
// bricks
    bricks.forEach(column =>{
        column.forEach(brick =>{
            if (brick.visible){
                if(ball.x - ball.size > brick.x && ball.x + ball.size < brick.x + brick.w && ball.y + ball.size > brick.y &&
                ball.y - ball.size < brick.y + brick.h
                ){
                ball.dy *= -1;
                brick.visible = false;

                increaseScore();
                }
            }
        });
    });
    //hit wall
    if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
    }
}
//increase score
function increaseScore() {
    score++;

    if(score % (brickRowCount * brickRowCount) === 0) {
        showAllBricks();
    }
}       
            
 function showAllBricks(){
     bricks.forEach(column =>{
         column.forEach(brick => brick.visible = true)
     })
 }         

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
// close and event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
