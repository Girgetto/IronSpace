$(document).ready(() => {
  const game = new Game();
  const newSpaceShip = new SpaceShip();
  let newPlanets = game.planets.map((planet) => new Planets(planet));
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

  function checkCollisionsWithGoal() {
    if (newGoal.collision) {
      game.setLevel(newSpaceShip);
      newGoal = new Goal(game.goal[0], game.goal[1]);

      newPlanets = game.planets.map((planet) => new Planets(planet));
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
    checkCollisionsWithGoal();
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
    newSpaceShip.dx = Math.cos(angle);
    newSpaceShip.dy = Math.sin(angle);
    update();
    if (isOver) return { isOver: true, reward: game.level };
    return { isOver: false, reward: game.level };
  }

  function startGame() {
    if (game.level !== 0 && game.level !== 6) {
      update();
      draw(newPlanets);
      game.levelText(newSpaceShip.ctx);
    } else if (game.level === 6) {
      game.winFrame(newSpaceShip.ctx);
    } else {
      clearSpaceShip();
      game.firstFrameDraw(newSpaceShip.ctx);
    }
  }
  //startTs(reset, startGame, applyCommands);
  setInterval(startGame, 1000 / 30);
});
