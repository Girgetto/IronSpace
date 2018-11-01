$(document).ready(() => {
  const audio = new Audio('audio/main.mp3');
  const game = new Game();
  const newSpaceShip = new SpaceShip();
  let newPlanets = new Planets(
    game.planet[0],
    game.planet[1],
    game.planet[2],
    game.planet[3],
  );
  let newPlanets2 = new Planets(
    game.planet2[0],
    game.planet2[1],
    game.planet2[2],
    game.planet2[3],
  );
  let newPlanets3 = new Planets(
    game.planet3[0],
    game.planet3[1],
    game.planet3[2],
    game.planet3[3],
  );
  let newGoal = new Goal(game.goal[0], game.goal[1]);

  // Musica principale
  audio.play();

  $(document).keypress((e) => {
    newSpaceShip.move(e.which);
    game.start(e.which);
  });

  function draw() {
    newSpaceShip.draw();
    newGoal.draw(newSpaceShip.ctx);
    newPlanets.draw(newSpaceShip.ctx);
    newPlanets2.draw(newSpaceShip.ctx);
    newPlanets3.draw(newSpaceShip.ctx);
  }

  function update() {
    newSpaceShip.update(newPlanets);
    newSpaceShip.update(newPlanets2);
    newGoal.update(newSpaceShip);
    newPlanets.collision(newSpaceShip);
    newPlanets2.collision(newSpaceShip);
    newPlanets3.collision(newSpaceShip);
    if (newGoal.collision) {
      game.level(newSpaceShip);
      newGoal = new Goal(game.goal[0], game.goal[1]);
      newPlanets = new Planets(
        game.planet[0],
        game.planet[1],
        game.planet[2],
        game.planet[3],
      );
      newPlanets2 = new Planets(
        game.planet2[0],
        game.planet2[1],
        game.planet2[2],
        game.planet2[3],
      );
      newPlanets3 = new Planets(
        game.planet3[0],
        game.planet3[1],
        game.planet3[2],
        game.planet3[3],
      );
      newSpaceShip.posX = 50;
      newSpaceShip.posY = newSpaceShip.canvas.height / 2;
      newSpaceShip.angle = 0;
      newSpaceShip.speed = 0;
      newSpaceShip.dx = 0;
      newSpaceShip.dy = 0;
      newGoal.collision = false;
    }
  }
  function startGame() {
    // Carica schermata inziale
    if (game.frame === 0) {
      newSpaceShip.ctx.clearRect(
        0,
        0,
        newSpaceShip.canvas.width,
        newSpaceShip.canvas.height,
      );
      game.firstFrameDraw(newSpaceShip.ctx);
    }
    // Incomincia la partita
    if ((game.frame !== 0) && (game.frame !== 6)) {
      update();
      draw();
      game.levelText(newSpaceShip.ctx);
    } else if (game.frame === 6) {
      // Schermata vittoria
      game.winFrame(newSpaceShip.ctx);
    }
  }
  setInterval(startGame, 1);
});
