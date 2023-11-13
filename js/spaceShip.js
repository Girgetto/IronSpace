const G_CONSTANT = 0.0000000667;
const map = {};
const A_KEY = 65;
const D_KEY = 68;
const W_KEY = 87;
const spaceShipColor = "#FFF";

function SpaceShip(ctx, canvas) {
  this.canvas = canvas;
  this.ctx = ctx;
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
  this.speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  this.gravityFormula = (planet, distance) =>
  (G_CONSTANT * planet.mass) / (distance * distance);
  this.baseImage = new Image();
  this.baseImage.src = './img/spaceship.png';
  this.baseImage.onload = () => {
    this.imageLoaded = true;
  };
}

SpaceShip.prototype.collision = function (planet) {
  let diffX = planet.posX - this.posX;
  let diffY = planet.posY - this.posY;
  let distance = Math.sqrt(diffX * diffX + diffY * diffY);
  let angle = Math.atan2(diffY, diffX);

  if (distance < planet.radius) {
    this.dx = 0;
    this.dy = 0;
  } else {
    let force = this.gravityFormula(planet, distance);
    this.dx += force * Math.cos(angle);
    this.dy += force * Math.sin(angle);
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

  if (this.imageLoaded) {
    this.ctx.rotate(Math.PI / 2);
    this.ctx.drawImage(
      this.baseImage,
      -this.baseImage.width / 8,
      -this.baseImage.height / 8,
      this.baseImage.width / 4,
      this.baseImage.height / 4
    );
  }

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
    this.throttle = true;
  } else {
    this.throttle = false;
  }

  if (map[A_KEY]) {
    this.angle -= 0.1;
  }

  if (map[D_KEY]) {
    this.angle += 0.1;
  }

  if (this.throttle) {
    this.dx += Math.cos(this.angle) * 0.1;
    this.dy += Math.sin(this.angle) * 0.1;
  }

  if (this.speed > this.maxSpeed) {
    this.dx *= 0.99;
    this.dy *= 0.99;
  }

  this.posX += this.dx;
  this.posY += this.dy;

  if (this.posX > this.W + 5) {
    this.posY = -5;
  }

  if (this.posX < -6) {
    this.posY = this.canvas.width + 6;
  }

  if (this.posX > this.H + 5) {
    this.posY = -5;
  }

  if (this.posY < -6) {
    this.posY = this.canvas.height + 6;
  }
};
