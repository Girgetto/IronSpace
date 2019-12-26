/**
 * @param  {number} posX - position x of goal
 * @param  {number} posY - position y of goal
 */
function Goal(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.collision = false;
  this.img = new Image();
  this.img.src = "img/descarga.png";
  this.audio = new Audio("audio/nextLevel.mp3");
}

Goal.prototype.draw = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.font = "20px invasion";
  ctx.fillText("TARGET", this.posX - 15, this.posY - 10);
  ctx.drawImage(this.img, this.posX, this.posY, 50, 50);
  ctx.closePath();
  ctx.restore();
};

Goal.prototype.update = function(ship) {
  if (
    this.posX < ship.posX &&
    ship.posX < this.posX + 50 &&
    this.posY < ship.posY &&
    ship.posY < this.posY + 50
  ) {
    this.audio.play();
    this.collision = true;
    return true;
  }
  return 0;
};
