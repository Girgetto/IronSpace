/* eslint-disable no-unused-vars */
const goalSteps = 100;
const scoreRequirement = 5000;
const initialGames = 5;

function TF(spaceship, clearInterval, game, reset, goal) {
  this.spaceship = spaceship;
  this.goal = goal;
  this.clearInterval = clearInterval;
  this.game = game;
  this.reset = reset;
  this.stepCounter = 0;
  this.gameCounter = 0;
  this.moves = [-0.1, 0.1, 0];
  this.linearModel = tf.sequential();
  this.trainingData = [];
}

TF.prototype.someRandomGame = function () {
  if (this.stepCounter < goalSteps && score > 0) {
    this.spaceship.angle += this.moves[Math.floor(Math.random() * (3 - 0))];
    this.spaceship.throttle = true;
    this.stepCounter++;
  } else if (this.gameCounter < initialGames) {
    this.reset();
    this.gameCounter++;
    this.stepCounter = 0;
    this.game.level = 1;
  } else {
    clearInterval();
  }
};

let scores = [];
let acceptedScores = [];
let prevObservation = [];
let score = 0;
let gameMemory = [];
TF.prototype.initialPopulation = function () {
  if (this.stepCounter < goalSteps && this.game.score > 0) {
    move = this.moves[Math.floor(Math.random() * (3 - 0))];
    this.spaceship.angle += move;
    this.spaceship.throttle = true;
    this.stepCounter++;
    if (prevObservation.length > 0) {
      gameMemory.push([
        prevObservation[0] >
          Math.abs(this.game.goal.posX - this.spaceship.posX) &&
        prevObservation[1] > Math.abs(this.game.goal.posY - this.spaceship.posY)
          ? -move
          : move,
        move,
      ]); // [better move, move took]
    }

    prevObservation = [
      Math.abs(this.game.goal.posX - this.spaceship.posX),
      Math.abs(this.game.goal.posY - this.spaceship.posY),
    ]; // [dPosX, dPosY]
    score += this.game.score;
  } else if (this.gameCounter < initialGames) {
    if (score >= scoreRequirement) {
      acceptedScores.push(score);
      this.trainingData = gameMemory;
      scores.push(score);
    }
    this.reset();
    this.gameCounter++;
    this.stepCounter = 0;
    this.game.level = 1;
    score = 0;
    prevObservation = [];
    gameMemory = [];
  } else {
    console.log(
      "Average accepted score " +
        acceptedScores.reduce((a, b) => a + b, 0) / acceptedScores.length
    );
    console.log(acceptedScores.length);
    clearInterval();
    this.neuralNetworkModel(this.trainingData);
  }
};

TF.prototype.neuralNetworkModel = function (trainingData) {
  this.linearModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  this.linearModel.compile({ loss: "meanSquaredError", optimizer: "sgd" });

  console.log(trainingData);

  const xs = tf.tensor1d(trainingData.map(data => data[0]));
  const ys = tf.tensor1d(trainingData.map(data => data[1]));

  this.linearModel.fit(xs, ys).then((info) => {
    console.log("Final accuracy", info.history);
  });
};
