/**
 * @param  {number} posX - of planet
 * @param  {number} posY - of planet
 * @param  {number} radius - of planet
 * @param  {number} density - of planet
 */
function Planet({ posX, posY, radius, density }) {
  this.posX = posX;
  this.posY = posY;
  this.radius = radius;
  this.area = Math.PI * Math.pow(this.radius, 2);
  this.density = density;
  this.mass = this.area * this.density;
  this.img = new Image();
  this.img.src = "./img/planet.png";
  //this.audio = new Audio("audio/metallic_space_impact.mp3");
}

Planet.prototype.draw = function (ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.drawImage(this.img, this.posX, this.posY, 100, 100);
  ctx.closePath();
  ctx.restore();
};

Planet.prototype.collision = function (ship) {
  if (
    ship.posX > this.posX - this.radius &&
    ship.posY > this.posY - this.radius &&
    ship.posX < this.posX + this.radius &&
    ship.posY < this.posY + this.radius
  ) {
    ship.posX = 50;
    ship.posY = ship.canvas.height / 2;
    ship.dx = 0;
    ship.dy = 0;
    ship.angle = 0;
    //this.audio.play();
  }
};
