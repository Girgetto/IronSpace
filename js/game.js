function Game() {
  this.level = 0;
  this.score = 100;
  this.planets = [];
  this.goal = {};
  this.firstClick = false;
}

Game.prototype.firstFrameDraw = function (ctx) {
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

Game.prototype.drawGameOver = function (ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.font = "80px invasion";
  ctx.fillText("GAME OVER", ctx.canvas.width / 3 - 50, ctx.canvas.height / 2);
  ctx.font = "50px invasion";
  ctx.closePath();
  ctx.restore();
};

Game.prototype.levelText = function (ctx) {
  if (this.level < 6) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.font = "50px invasion";
    ctx.fillText(`LEVEL ${this.level}`, 50, 50);
    ctx.fillStyle = "#fff";
    ctx.font = "50px invasion";
    ctx.fillText(`SCORE ${this.score}`, ctx.canvas.width - 350, 50);
    ctx.closePath();
    ctx.restore();
  }
};

Game.prototype.winFrame = function (ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#fff";
  ctx.font = "80px invasion";
  ctx.fillText("YOU WIN!", ctx.canvas.width / 3, ctx.canvas.height / 2);
  ctx.closePath();
  ctx.restore();
};

Game.prototype.start = function (e, spaceShip) {
  if (e === 13 && this.firstClick === false) {
    this.level++;
    this.firstClick = true;
    this.setLevel(spaceShip);
  }
};

Game.prototype.setLevel = function (ctx) {
  const levels = [
    null,
    { goal: { posX: 200, posY: 400 }, planets: [] },
    level1,
    level2,
    level3,
    level4(ctx),
  ];

  this.planets = levels[this.level].planets;

  this.goal = levels[this.level].goal;

  this.level++;

  return true;
};
