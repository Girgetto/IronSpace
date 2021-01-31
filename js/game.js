function Game(ctx) {
  this.level = 0;
  this.score = 100;
  this.planets = [];
  this.goal = {};
  this.firstClick = true;
  this.ctx = ctx;
}

Game.prototype.firstFrameDraw = function () {
  this.ctx.save();
  this.ctx.beginPath();
  this.ctx.font = "80px invasion";
  this.ctx.fillStyle = "#fff";
  this.ctx.fillText(
    "IRONSPACE",
    this.ctx.canvas.width / 3 - 50,
    this.ctx.canvas.height / 2
  );
  this.ctx.font = "50px invasion";
  this.ctx.fillText(
    "PRESS ENTER TO START",
    this.ctx.canvas.width / 4,
    this.ctx.canvas.height / 2 + 70
  );
  this.ctx.closePath();
  this.ctx.restore();
};

Game.prototype.drawGameOver = function () {
  this.ctx.save();
  this.ctx.beginPath();
  this.ctx.fillStyle = "#fff";
  this.ctx.font = "80px invasion";
  this.ctx.fillText(
    "GAME OVER",
    this.ctx.canvas.width / 3 - 50,
    this.ctx.canvas.height / 2
  );
  this.ctx.font = "50px invasion";
  this.ctx.closePath();
  this.ctx.restore();
};

Game.prototype.levelText = function () {
  if (this.level < 6) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "50px invasion";
    this.ctx.fillText(`LEVEL ${this.level}`, 50, 50);
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "50px invasion";
    this.ctx.fillText(`SCORE ${this.score}`, this.ctx.canvas.width - 350, 50);
    this.ctx.closePath();
    this.ctx.restore();
  }
};

Game.prototype.winFrame = function () {
  this.ctx.save();
  this.ctx.beginPath();
  this.ctx.fillStyle = "#fff";
  this.ctx.font = "80px invasion";
  this.ctx.fillText(
    "YOU WIN!",
    this.ctx.canvas.width / 3,
    this.ctx.canvas.height / 2
  );
  this.ctx.closePath();
  this.ctx.restore();
};

Game.prototype.start = function (e, engine) {
  this.level++;
  this.firstClick = false;
  this.setLevel(this.ctx);
  return setInterval(engine, 1000 / 30);
};

Game.prototype.setLevel = function () {
  const levels = [
    { goal: { posX: 300, posY: 300 }, planets: [] },
    level1,
    level2,
    level3,
    level4(this.ctx),
  ];

  this.planets = levels[this.level].planets;

  this.goal = levels[this.level].goal;

  return true;
};
