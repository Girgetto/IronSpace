function Game() {
  this.frame = 0;
  this.planet = [];
  this.planet2 = [];
  this.goal = [900, 500];
  this.firstClick = false;
}

Game.prototype.firstFrameDraw = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.font = "80px serif";
  ctx.fillText("START", ctx.canvas.width / 3 + 50, ctx.canvas.height / 2);
  ctx.fillText(
    "(PRESS ENTER)",
    ctx.canvas.width / 3 - 50,
    ctx.canvas.height / 2 + 70
  );
  ctx.closePath();
  ctx.restore();
};

Game.prototype.winFrame = function(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.font = "80px serif";
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

Game.prototype.level = function() {
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
  this.frame++;
  return true;
};
