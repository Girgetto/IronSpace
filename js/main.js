$(document).ready(() => {
  const game = new Game();
  const spaceShip = new SpaceShip();
  let planets = game.planets.map((planet) => new Planets(planet));
  let goal = new Goal(game.goal);

  $(document).keypress((e) => {
    spaceShip.setListeners(e.which);
    game.start(e.which, spaceShip);
  });

  function draw(planetsToDraw) {
    spaceShip.draw();
    goal.draw(spaceShip.ctx);
    planetsToDraw.forEach((planet) => {
      planet.draw(spaceShip.ctx);
    });
  }

  function resetGame() {
    spaceShip.posX = 50;
    spaceShip.posY = spaceShip.canvas.height / 2;
    spaceShip.angle = 0;
    spaceShip.speed = 0;
    spaceShip.dx = 0;
    spaceShip.dy = 0;
    goal.collision = false;
    game.score = 100;
  }

  function checkCollisionsWithGoal() {
    if (goal.collision) {
      game.setLevel(spaceShip);
      goal = new Goal(game.goal[0], game.goal[1]);

      planets = game.planets.map((planet) => new Planets(planet));
      resetGame();
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
    tenserFlow.someRandomGame();
    if (checkIfGameOver()) {
      clearInterval(interval);
      startGame();
      game.drawGameOver(spaceShip.ctx);
      clearCanvas();
    }
  }

  function startGame() {
    if (game.level !== 0 && game.level !== 6) {
      update();
      draw(planets);
      game.levelText(spaceShip.ctx);
    } else if (game.level === 6) {
      game.winFrame(spaceShip.ctx);
    } else {
      clearCanvas();
      game.firstFrameDraw(spaceShip.ctx);
    }
  }
  const tenserFlow = new TF(spaceShip, clearInterval, game, resetGame);
  const interval = setInterval(startGame, 1000 / 30);
});
