/**
 * @param  {number} posX - of planet
 * @param  {number} posY - of planet
 * @param  {number} radius - of planet
 * @param  {number} density - of planet
 */
function Planets(posX, posY, radius, density) {
  this.posX = posX;
  this.posY = posY;
  this.radius = radius;
  this.area = Math.PI * this.radius ** 2;
  this.density = density;
  this.mass = this.area * this.density;
  this.audio = new Audio("audio/metallic_space_impact.mp3");
}

Planets.prototype.draw = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.filter = "blur(10px)";
  ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, true);
  ctx.fillStyle = "rgb(255, 187, 123)";
  ctx.stroke();
  ctx.strokeStyle = "#fff";
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

Planets.prototype.collision = function(ship) {
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
    this.audio.play();
  }
};
