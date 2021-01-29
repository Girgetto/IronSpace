$(document).ready(() => {
  const game = new Game();
  const spaceShip = new SpaceShip();
  let newPlanets = game.planets.map((planet) => new Planets(planet));
  let newGoal = new Goal(game.goal[0], game.goal[1]);

  $(document).keypress((e) => {
    spaceShip.setListeners(e.which);
    game.start(e.which);
  });

  function draw(planetsToDraw) {
    spaceShip.draw();
    newGoal.draw(spaceShip.ctx);
    planetsToDraw.forEach((planet) => {
      planet.draw(spaceShip.ctx);
    });
  }

  function reset() {
    spaceShip.posX = 50;
    spaceShip.posY = spaceShip.canvas.height / 2;
    spaceShip.angle = 0;
    spaceShip.speed = 0;
    spaceShip.dx = 0;
    spaceShip.dy = 0;
    newGoal.collision = false;
  }

  function checkCollisionsWithGoal() {
    if (newGoal.collision) {
      game.setLevel(spaceShip);
      newGoal = new Goal(game.goal[0], game.goal[1]);

      newPlanets = game.planets.map((planet) => new Planets(planet));
      reset();
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
    newPlanets.forEach((planet) => spaceShip.collision(planet));
    spaceShip.update();
    isOver = newGoal.update(spaceShip);
    newPlanets.forEach((planet) => {
      planet.collision(spaceShip);
    });
    checkCollisionsWithGoal();
    game.score--;
    if (checkIfGameOver()) {
      clearInterval(interval);
      game.drawGameOver(spaceShip.ctx);
      clearCanvas();
    }
    tenserFlow.someRandomGame(spaceShip, clearInterval, game);
  }

  function startGame() {
    if (game.level !== 0 && game.level !== 6) {
      update();
      draw(newPlanets);
      game.levelText(spaceShip.ctx);
    } else if (game.level === 6) {
      game.winFrame(spaceShip.ctx);
    } else {
      clearCanvas();
      game.firstFrameDraw(spaceShip.ctx);
    }
  }
  const tenserFlow = new TF();
  const interval = setInterval(startGame, 1000 / 30);
});
