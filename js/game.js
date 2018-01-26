function Game() {
  this.frame = 0;
  this.planet = [];
  this.planet2 = [];
  this.planet3 = [];
  this.goal = [900, 500];
  this.firstClick = false;
}

Game.prototype.firstFrameDraw = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.font = "80px invasion";
  ctx.fillText("IRONSPACE", ctx.canvas.width / 3 - 50, ctx.canvas.height / 2);
  ctx.font = "50px invasion";
  ctx.fillText(
    "PRESS ENTER TO START",
    ctx.canvas.width / 4,
    ctx.canvas.height / 2 + 70
  );
  ctx.closePath();
  ctx.restore();
};

Game.prototype.levelText = function(ctx) {
  if (this.frame < 6) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.font = "50px invasion";
    ctx.fillText("LEVEL" + this.frame, 50, 50);
    ctx.closePath();
    ctx.restore();
  }
};

Game.prototype.winFrame = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.font = "80px invasion";
  ctx.fillText("YOU WIN!", ctx.canvas.width / 3, ctx.canvas.height / 2);
  ctx.closePath();
  ctx.restore();
};

Game.prototype.start = function(e) {
  if (e == 13 && this.firstClick == false) {
    this.frame++;
    this.firstClick = true;
  }
};

Game.prototype.level = function(ctx) {
  if (this.frame == 1) {
    this.goal = [100, 100];
    this.planet = [500, 500, 50, 1 * 10 ** 8];
  }
  if (this.frame == 2) {
    this.goal = [900, 500];
    this.planet = [800, 500, 50, 1 * 10 ** 8];
    this.planet2 = [500, 100, 70, 1 * 10 ** 8];
    this.firstClick = false;
  }
  if (this.frame == 3) {
    this.goal = [1000, 500];
    this.planet = [800, 500, 80, 1 * 10 ** 8];
    this.planet2 = [500, 300, 70, 1 * 10 ** 8];
  }
  if (this.frame == 4) {
    this.goal = [ctx.canvas.width / 2, ctx.canvas.height / 2];
    this.planet = [600, 200, 80, 1 * 10 ** 8];
    this.planet2 = [400, 350, 60, 1 * 10 ** 8];
    this.planet3 = [600, 600, 70, 1 * 10 ** 8];
  }
  this.frame++;
  return true;
};
