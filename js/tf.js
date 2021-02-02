/* eslint-disable no-unused-vars */
const goalSteps = 100;
const scoreRequirement = 5000;
const initialGames = 10;

let scores = [];
let acceptedScores = [];
let prevObservation = [];
let score = 0;
let gameMemory = [];

function TF(spaceship, clearInterval, game, reset, startGame) {
  this.spaceship = spaceship;
  this.clearInterval = clearInterval;
  this.game = game;
  this.reset = reset;
  this.stepCounter = 0;
  this.gameCounter = 0;
  this.moves = [-0.1, 0.1];
  this.linearModel = null;
  this.trainingData = [];
  this.startGame = startGame;
  this.normalizationData = {};
}

TF.prototype.initialPopulation = function () {
  if (this.linearModel !== null) return;
  if (
    this.stepCounter < goalSteps &&
    this.game.score > 0 &&
    this.game.level > 0
  ) {
    move = this.moves[Math.floor(Math.random() * (2 - 0))];
    this.spaceship.angle += move;
    this.spaceship.throttle = true;
    this.stepCounter++;
    let observations = [
      this.spaceship.posX / 100,
      this.spaceship.posY / 100,
      this.game.goal.posY / 100,
      this.game.goal.posY / 100,
      this.spaceship.dx / 100,
      this.spaceship.dy / 100,
      this.spaceship.angle / 100,
    ];

    if (prevObservation.length > 0) {
      gameMemory.push([observations, move === 0.1 ? [0, 1] : [1, 0]]);
    }

    prevObservation = observations;

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
    this.clearInterval();
    if (this.trainingData.length > 0)
      return this.neuralNetworkModel(this.trainingData);
  }
};

TF.prototype.neuralNetworkModel = function (trainingData) {
  const inputs = trainingData.map((data) => data[0].map((e) => e));
  const labels = trainingData.map((data) => data[1]);

  const xs = tf.tensor2d(inputs, [inputs.length, 7]);
  const ys = tf.tensor2d(labels, [labels.length, 2]);

  this.linearModel = tf.sequential();

  this.linearModel.add(
    tf.layers.dense({
      units: 2,
      inputShape: [inputs[0].length],
    })
  );

  this.linearModel.compile({
    loss: "categoricalCrossentropy",
    optimizer: tf.train.adam(),
  });

  const batchSize = 32;
  const epochs = 50;

  this.linearModel
    .fit(xs, ys, {
      batchSize,
      epochs,
      callbacks: tfvis.show.fitCallbacks(
        { name: "Training Performance" },
        ["loss", "mse"],
        { height: 200, callbacks: ["onEpochEnd"] }
      ),
    })
    .then((info) => {
      console.log("Final accuracy", info.history);
      this.linearModel.save("localstorage://my-model").then(() => {
        this.game.isTrained = true;
        this.stepCounter = 0;
        this.gameCounter = 0;
        console.log("saved");
      });
    });
};

TF.prototype.startTrainedModel = function () {
  const { inputMax, inputMin, labelMin, labelMax } = this.normalizationData;
  tf.loadLayersModel("localstorage://my-model").then((model) => {
    tfvis.show.modelSummary({ name: "Model Summary" }, model);
    this.linearModel = model;
    if (this.stepCounter < goalSteps && this.game.score > 0) {
      let observations = [
        this.spaceship.posX / 100,
        this.spaceship.posY / 100,
        this.game.goal.posY / 100,
        this.game.goal.posY / 100,
        this.spaceship.dx / 100,
        this.spaceship.dy / 100,
        this.spaceship.angle / 100,
      ];

      let prediction = this.linearModel.predict(
        tf.tensor2d(observations, [1, 7])
      );

      console.log(prediction.dataSync());

      move = prediction.dataSync()[0] < prediction.dataSync()[1] ? 0.1 : -0.1;

      this.spaceship.angle += move;
      this.spaceship.throttle = true;
      this.stepCounter++;
      score += this.game.score;
    } else if (this.gameCounter < initialGames) {
      this.reset();
      this.gameCounter++;
      this.stepCounter = 0;
      this.game.level = 1;
      score = 0;
    } else {
      clearInterval();
    }
  });
};
