const G_CONSTANT = 0.0000000000667;

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
  this.audio = new Audio(
    "audio/Rocket Thrusters-SoundBible.com-1432176431.mp3"
  );
  this.tutorial = true;
  this.throttle = false;
  this.maxSpeed = 5;
  this.gravityFormula = (newPlanets) =>
    (G_CONSTANT * newPlanets.mass) / distance ** 2;
}

SpaceShip.prototype.collision = function (newPlanets) {
  diffX = newPlanets.posX - this.posX;
  diffY = newPlanets.posY - this.posY;
  distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  if (newPlanets.posX > this.posX || newPlanets.posY > this.posY) {
    this.dx += this.gravityFormula(newPlanets);
  }
  if (newPlanets.posX < this.posX || newPlanets.posY < this.posY) {
    this.dx -= this.gravityFormula(newPlanets);
  }
  if (distance < newPlanets.radius) {
    this.dx = 0;
    this.dy = 0;
  }
};

SpaceShip.prototype.update = function () {
  this.posY += this.dy;
  this.posX += this.dx;

  if (this.angle > 2 * Math.PI || this.angle < -2 * Math.PI) {
    this.angle = 0;
  }
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
    this.dx += 0.1;
  }
  if (this.posY < 0) {
    this.dy += 0.1;
  }
  if (this.posX > this.canvas.width) {
    this.dx -= 0.1;
  }
  if (this.posY > this.canvas.height) {
    this.dy -= 0.1;
  }
};

SpaceShip.prototype.setListeners = function () {
  document.onkeydown = function (event) {
    if (event.keyCode == 37) this.angle += 3;
    if (event.keyCode == 39) this.angle -= 3;
    if (event.keyCode == 38) this.throttle = true;
  }.bind(this);
  document.onkeyup = function (event) {
    if (event.keyCode == 38) this.throttle = false;
  }.bind(this);
};

SpaceShip.prototype.move = function () {
  if (this.throttle) {
    this.dx += Math.cos(this.angle * 2) * 0.15;
    this.dy += Math.sin(this.angle * 2) * 0.15;
  } else {
    this.dx *= 0.98;
    this.dy *= 0.98;
  }
  if (this.speed > this.maxSpeed) {
    this.dx *= this.maxSpeed;
    this.dy *= this.maxSpeed;
  }

  this.x += this.dx;
  this.y += this.dy;

  if (this.x > this.W + 5) this.x = -5;
  if (this.x < -6) this.x = this.canvas.width + 6;
  if (this.y > this.H + 5) this.y = -5;
  if (this.y < -6) this.y = this.canvas.height + 6;
};
