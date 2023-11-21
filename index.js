const canvas = document.getElementById("canvas");

canvas.width = 300;
canvas.height = 350;

const ctx = canvas.getContext("2d");

// ctx.fillStyle = 'orange'
// ctx.fillRect(0, 0, 10, 30)

// ctx.fillStyle = 'red'
// ctx.fillRect(canvas.width -10, 0, 10, 30)

const countScores = {
  left: 0,
  right: 0,
};
class GetPaddle {
  x;
  y = 120;
  w;
  h = 50;
  color;
  speed = 40;
  constructor({ x = 1, w, color = "green" }) {
    this.x = x;
    this.w = w;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  movePaddleUp() {
    if (this.y < 10) return;
    this.y -= this.speed;
  }

  movePaddleDown() {
    if (this.y > canvas.height - 40) return;
    this.y += this.speed;
  }
  colisionsController(b) {
    return (
      this.x < b.w + b.x &&
      this.x - this.w > b.x &&
      this.y < b.y + b.h &&
      this.y + this.h > b.y
    );
  }
}

function drawCourt() {
  ctx.strokeStyle = 'violet'
  ctx.strokeWidth = 11;
  ctx.lineWidth = 5;
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, 7);
  ctx.stroke();
  ctx.closePath();
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.lineWidth = 5
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
  ctx.closePath();
}

//Ball
function getBall() {
  return {
    x: canvas.width / 2,
    y: canvas.height / 2,
    w: 10,
    h: 10,
    color: "red",
    directionX: "left",
    directionY: "up",
    speedX: 1,
    speedY: 1,
    friction: 0.2,
    isMoving: false,
    ballMovement() {
      if (!this.isMoving) return;
      //left right
      if (this.x < 0 + this.w) {
        this.directionX = "right";
      } else if (this.x > canvas.width - this.w) {
        this.directionX = "left";
      }

      if (this.directionX === "right") {
        this.speedX++;
      } else if (this.directionX === "left") {
        this.speedX--;
      }

      this.x += this.speedX;
      this.speedX *= this.friction;

      //up, down
      if (this.y < 0 + this.h) {
        this.directionY = "down";
      } else if (this.y > canvas.height - this.h) {
        this.directionY = "up";
      }
      if (this.directionY === "up") {
        this.speedY--;
      } else {
        this.speedY++;
      }
      this.y += this.speedY;
      this.speedY *= this.friction;
    },
    draw() {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();
    },
  };
}

const paddleLeft = new GetPaddle({ x: 10, w: -10 });

const paddleRight = new GetPaddle({
  x: canvas.width - 11,
  w: 8,
  color: "red",
});
let ball = getBall();

//RENDER

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCourt();
  scores();
  paddleRight.draw();
  paddleLeft.draw();
  ball.draw();
  ball.ballMovement();
  checkColisions(ball);
  requestAnimationFrame(render);
}

//Evento Teclas
// w = 87  s= 83 a= 65 d = 68 space o = 79, l = 76
addEventListener("keydown", (e) => {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 87:
      paddleLeft.movePaddleUp();
      break;
    case 83:
      paddleLeft.movePaddleDown();
      break;
    case 79:
      paddleRight.movePaddleUp();

      break;
    case 76:
      paddleRight.movePaddleDown();

      break;
    case 32:
      ball.isMoving = !ball.isMoving;
      break;
    default:
      break;
  }
});


function checkColisions(element) {
  if (paddleLeft.colisionsController(element)) {
    element.directionX = "right";
    element.friction += element.friction < 0.6 && 0.05;
    //element.isMoving = false
  } else if (paddleRight.colisionsController(element)) {
    element.directionX = "left";
    element.friction += element.friction < 0.6 && 0.05;
    //element.isMoving = false
  }

  if (element.x - element.w < 0) {
    countScores.right += 1;
    element.friction = 0.2;
    element.x = canvas.width / 2;
    element.y = canvas.height / 2;
    element.directionX = "right";
    element.isMoving = false;
  }

  if (element.x + element.w > canvas.width) {
    countScores.left += 1;
    element.friction = 0.2;
    element.x = canvas.width / 2;
    element.y = canvas.height / 2;
    element.directionX = "left";
    element.isMoving = false;
  }
}

function scores() {
  ctx.fillStyle = "grey";
  ctx.font = '24px "Press Start 2P"';
  ctx.fillText(countScores.left, 70, 70);
  ctx.fillText(countScores.right, canvas.width - 80, 70);
}
requestAnimationFrame(render);
