$(document).ready(() => {
  const spaceShip = new SpaceShip();
  const game = new Game(spaceShip.ctx);
  let interval = null;
  let planets = null;
  let goal = null;
  const time = 1000;
  const isMLOn = false;
  const SCORE = 1000;

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
    game.score = time;
    game.score = SCORE;
    game.setLevel();
    goal = new Goal(game.goal);
    planets = game.planets.map((planet) => new Planets(planet));
    game.firstClick = true;
  }

  function checkCollisionsWithGoal() {
    if (goal.collision) {
      game.setLevel();
      game.level++;
      game.score = time;
      game.score = SCORE;
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
    goal.update(spaceShip);
    planets.forEach((planet) => {
      planet.collision(spaceShip);
    });
    checkCollisionsWithGoal();
    game.score--;
<<<<<<< HEAD
=======
    // !game.isTrained
    //   ? tenserFlow.initialPopulation()
    //   : tenserFlow.startTrainedModel();
>>>>>>> 8389e944fe0b24891fae62b51fb6f6aa9783bc5d
    if (checkIfGameOver()) {
      game.level = 7;
      game.firstClick = true;
    }
    if(isMLOn) {
      !game.isTrained
      ? tenserFlow.initialPopulation()
      : tenserFlow.startTrainedModel();
    }
  }

  function engine() {
    if (game.level === 6) {
      game.winFrame();
    } else if (game.level === 7) {
      clearInterval(interval);
      clearCanvas();
      game.drawGameOver();
    } else {
      update();
      draw();
    }
  }
  game.firstFrameDraw();

  function startGame() {
    resetGame();
    interval = game.start(engine);
  }

  $(document).keypress((e) => {
    if (e.which === 13 && game.firstClick) {
      spaceShip.setListeners(e.which);
      startGame();
    }
  });

  const tenserFlow = new TF(
    spaceShip,
    () => clearInterval(interval),
    game,
    resetGame,
    startGame
  );
});
