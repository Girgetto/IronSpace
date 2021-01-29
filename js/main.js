$(document).ready(() => {
  const spaceShip = new SpaceShip();
  const game = new Game(spaceShip.ctx);
  let interval = null;
  let goal = null;
  let planets = null;

  function draw() {
    spaceShip.draw();
    goal.draw(spaceShip.ctx);
    game.levelText(spaceShip.ctx);
    planets.forEach((planet) => {
      planet.draw(spaceShip.ctx);
    });
  }

  function resetSpaceShip() {
    spaceShip.posX = 50;
    spaceShip.posY = spaceShip.canvas.height / 2;
    spaceShip.angle = 0;
    spaceShip.speed = 0;
    spaceShip.dx = 0;
    spaceShip.dy = 0;
  }

  function resetGame() {
    resetSpaceShip();
    game.level = 0;
    game.setLevel();
    goal = new Goal(game.goal);
    planets = game.planets.map((planet) => new Planets(planet));
    game.firstClick = true;
  }

  function checkCollisionsWithGoal() {
    if (goal.collision) {
      game.setLevel();
      game.level++;
      resetSpaceShip();
      goal = new Goal(game.goal);
      planets = game.planets.map((planet) => new Planets(planet));
    }
  }

  function clearCanvas() {
    spaceShip.ctx.clearRect(
      0,
      0,
      spaceShip.canvas.width,
      spaceShip.canvas.height
    );
  }

  function checkIfGameOver() {
    return game.score <= 0;
  }

  function update() {
    planets.forEach((planet) => spaceShip.collision(planet));
    spaceShip.update();
    isOver = goal.update(spaceShip);
    planets.forEach((planet) => {
      planet.collision(spaceShip);
    });
    checkCollisionsWithGoal();
    game.score--;
    //tenserFlow.someRandomGame();
    if (checkIfGameOver()) {
      resetGame();
      clearCanvas();
      game.drawGameOver();
      clearInterval(interval);
    }
  }

  $(document).keypress((e) => {
    if (e.which === 13 && game.firstClick) {
      spaceShip.setListeners(e.which);
      resetGame();
      interval = game.start(e.which, engine);
    }
  });

  function engine() {
    update();
    draw();
  }

  if (game.level !== 0) {
    interval = game.start(e.which, engine);
  } else if (game.level === 6) {
    game.winFrame();
  } else {
    clearCanvas();
    game.firstFrameDraw();
  }

  const tenserFlow = new TF(spaceShip, clearInterval, game, resetGame);
});
