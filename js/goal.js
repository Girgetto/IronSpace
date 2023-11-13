/**
 * @param  {number} posX - position x of goal
 * @param  {number} posY - position y of goal
 */
function Goal({ posX, posY }) {
  this.posX = posX;
  this.posY = posY;
  this.width = 100;
  this.height = 100;
  this.collision = false;
  this.img = new Image();
  this.img.src = "./img/target.png";
  //this.audio = new Audio("audio/nextLevel.mp3");
}

Goal.prototype.draw = function (ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.font = "20px invasion";
  ctx.fillText("TARGET", this.posX - 15, this.posY - 10);
  ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  ctx.closePath();
  ctx.restore();
};

Goal.prototype.update = function (ship) {
  const checkCollisionWithShip = () =>
    this.posX <= ship.posX &&
    ship.posX <= this.posX + this.width &&
    this.posY <= ship.posY &&
    ship.posY <= this.posY + this.height;

  //this.audio.play();
  this.collision = checkCollisionWithShip();

  return checkCollisionWithShip();
};
