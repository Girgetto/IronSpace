$(document).ready(() => {
  const game = new Game();
  const newSpaceShip = new SpaceShip();
  let newPlanets = game.planets.map(
    (planet) => new Planets(planet[0], planet[1], planet[2], planet[3])
  );
  let newGoal = new Goal(game.goal[0], game.goal[1]);
  let isOver = false;

  $(document).keypress((e) => {
    newSpaceShip.setListeners(e.which);
    game.start(e.which);
  });

  function draw(planetsToDraw) {
    newSpaceShip.draw();
    newGoal.draw(newSpaceShip.ctx);
    planetsToDraw.forEach((planet) => {
      planet.draw(newSpaceShip.ctx);
    });
  }

  function reset() {
    newSpaceShip.posX = 50;
    newSpaceShip.posY = newSpaceShip.canvas.height / 2;
    newSpaceShip.angle = 0;
    newSpaceShip.speed = 0;
    newSpaceShip.dx = 0;
    newSpaceShip.dy = 0;
    newGoal.collision = false;
  }

  function checkCollisions() {
    if (newGoal.collision) {
      game.level(newSpaceShip);
      newGoal = new Goal(game.goal[0], game.goal[1]);

      newPlanets = game.planets.planets.map(
        (planet) => new Planets(planet[0], planet[1], planet[2], planet[3])
      );
      reset();
    }
  }

  function update() {
    newPlanets.forEach((planet) => newSpaceShip.collision(planet));
    newSpaceShip.update();
    isOver = newGoal.update(newSpaceShip);
    newPlanets.forEach((planet) => {
      planet.collision(newSpaceShip);
    });
    checkCollisions();
  }

  function clearSpaceShip() {
    newSpaceShip.ctx.clearRect(
      0,
      0,
      newSpaceShip.canvas.width,
      newSpaceShip.canvas.height
    );
  }

  function applyCommands(angle) {
    newSpaceShip.angle = angle;
    newSpaceShip.dx = Math.cos(angle) * 100;
    newSpaceShip.dy = Math.sin(angle) * 100;
    update();
    if (isOver) return { isOver: true, reward: game.frame };
    return { isOver: false, reward: game.frame };
  }

  function startGame() {
    if (game.level !== 0 && game.level !== 6) {
      update();
      draw(newPlanets);
      game.levelText(newSpaceShip.ctx);
    } else if (game.frame === 6) {
      game.winFrame(newSpaceShip.ctx);
    } else {
      clearSpaceShip();
      game.firstFrameDraw(newSpaceShip.ctx);
    }
  }
  startTs(reset, startGame, applyCommands);
  //setInterval(startGame, 1000 / 30);
});
