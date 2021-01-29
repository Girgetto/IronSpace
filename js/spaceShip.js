const G_CONSTANT = 0.0000000667;
const map = {};
const A_KEY = 65;
const D_KEY = 68;
const W_KEY = 87;
var alias = {
  D_KEY: 68,
  W_KEY: 87,
  A_KEY: 65,
};

function SpaceShip() {
  this.canvas = document.getElementById("myCanvas");
  this.ctx = this.canvas.getContext("2d");
  this.posX = 50;
  this.posY = this.canvas.height / 2;
  this.v = [
    [-5, -10],
    [-5, 0],
    [10, -5],
  ];
  this.angle = 0;
  this.dx = 0;
  this.dy = 0;
  this.dAngle = 0;
  //this.audio = new Audio("audio/rocket.mp3");
  this.tutorial = true;
  this.throttle = false;
  this.isTurningRight = false;
  this.isTurningLeft = false;
  this.maxSpeed = 5;
  this.gravityFormula = (planet) =>
    (G_CONSTANT * planet.mass) / Math.pow(distance, 2);
}

SpaceShip.prototype.collision = function (planet) {
  diffX = planet.posX - this.posX;
  diffY = planet.posY - this.posY;
  distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  if (planet.posX > this.posX || planet.posY > this.posY) {
    this.dx += this.gravityFormula(planet);
    this.dy += this.gravityFormula(planet);
  }
  if (planet.posX < this.posX || planet.posY < this.posY) {
    this.dx -= this.gravityFormula(planet);
    this.dy -= this.gravityFormula(planet);
  }
  if (distance < planet.radius) {
    this.dx = 0;
    this.dy = 0;
  }
};

SpaceShip.prototype.update = function () {
  this.posY += this.dy;
  this.posX += this.dx;
  this.angle += this.dAngle;
  this.move();
};

SpaceShip.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.save();
  this.ctx.translate(this.posX, this.posY);
  this.ctx.rotate(this.angle);
  this.ctx.fillStyle = "#073763";
  this.ctx.strokeStyle = "#FFF";
  this.ctx.beginPath();
  this.ctx.moveTo(this.v[0][0], this.v[0][1]);
  this.ctx.lineTo(this.v[1][0], this.v[1][1]);
  this.ctx.lineTo(this.v[2][0], this.v[2][1]);
  if (this.tutorial) {
    this.ctx.save();
    this.ctx.font = "20px invasion";
    this.ctx.fillStyle = "#fff";
    this.ctx.fillText("W Forward", this.v[0][0] + 30, this.v[0][1] + 10);
    this.ctx.fillText("A Turn", this.v[0][0], this.v[0][1] - 10);
    this.ctx.fillText("D Turn", this.v[0][0], this.v[0][1] + 30);
    this.ctx.restore();
  }
  this.ctx.closePath();
  this.ctx.stroke();
  this.ctx.fill();
  this.ctx.restore();

  if (this.posX < 0) {
    this.dx *= -1;
  }
  if (this.posY < 0) {
    this.dy *= -1;
  }
  if (this.posX > this.canvas.width) {
    this.dx *= -1;
  }
  if (this.posY > this.canvas.height) {
    this.dy *= -1;
  }
};

SpaceShip.prototype.setListeners = function () {
  onkeydown = onkeyup = function (e) {
    this.tutorial = false;
    e = e || event;
    map[e.keyCode] = e.type == "keydown";
  };
};

SpaceShip.prototype.move = function () {
  if (map[W_KEY]) {
    this.tutorial = false;
    this.dx += Math.cos(this.angle) * 10;
    this.dy += Math.sin(this.angle) * 10;
  } else {
    this.dx *= 0.99;
    this.dy *= 0.99;
  }

  if (map[A_KEY]) {
    this.angle -= 0.1;
  }

  if (map[D_KEY]) {
    this.angle += 0.1;
  }

  let speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  if (speed > this.maxSpeed) {
    this.dx *= this.maxSpeed / speed;
    this.dy *= this.maxSpeed / speed;
  }

  this.x += this.dx;
  this.y += this.dy;

  if (this.x > this.W + 5) this.x = -5;
  if (this.x < -6) this.x = this.canvas.width + 6;
  if (this.y > this.H + 5) this.y = -5;
  if (this.y < -6) this.y = this.canvas.height + 6;
};
