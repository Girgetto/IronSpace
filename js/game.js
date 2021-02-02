function Game() {
  this.frame = 0;
  this.planets = [];
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
    ctx.fillText(`LEVEL${this.frame}`, 50, 50);
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
  if (e === 13 && this.firstClick === false) {
    this.frame++;
    this.firstClick = true;
  }
};

Game.prototype.level = function(ctx) {
  var levels = [null, level1, level2, level3, level4(ctx)];

  this.planets = levels[this.frame];

  this.goal = this.planets && this.planets.goal;

  this.frame++;

  return true;
};
