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
      parseInt(this.spaceship.posX) / 100,
      parseInt(this.spaceship.posY) / 100,
      parseInt(this.game.goal.posY) / 100,
      parseInt(this.game.goal.posY) / 100,
      parseInt(this.spaceship.dx) / 100,
      parseInt(this.spaceship.dy) / 100,
      parseInt(this.spaceship.angle) / 100,
    ];

    gameMemory.push([observations, move === 0.1 ? [0, 1] : [1, 0]]);

    score += this.game.score;
  } else if (this.gameCounter < initialGames) {
    if (score >= scoreRequirement) {
      this.trainingData = [...this.trainingData, ...gameMemory];
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
    if (this.trainingData.length > 0) this.neuralNetworkModel();
  }
};

TF.prototype.neuralNetworkModel = function () {
  const inputs = this.trainingData.map((data) => data[0].map((e) => e));
  const labels = this.trainingData.map((data) => data[1]);

  this.linearModel = tf.sequential();

  this.linearModel.add(
    tf.layers.dense({
      units: inputs[0].length,
      inputShape: [inputs[0].length],
      activation: "relu",
    })
  );

  this.linearModel.add(
    tf.layers.dense({
      units: labels[0].length,
      activation: "softmax",
    })
  );

  this.linearModel.compile({
    loss: "categoricalCrossentropy",
    optimizer: tf.train.adam(),
  });

  const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
  const ys = tf.tensor2d(labels, [labels.length, labels[0].length]);
  const batchSize = 32;
  const epochs = 10;

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
        parseInt(this.spaceship.posX) / 100,
        parseInt(this.spaceship.posY) / 100,
        parseInt(this.game.goal.posY) / 100,
        parseInt(this.game.goal.posY) / 100,
        parseInt(this.spaceship.dx) / 100,
        parseInt(this.spaceship.dy) / 100,
        parseInt(this.spaceship.angle) / 100,
      ];

      let prediction = tf.tidy(() => {
        return this.linearModel.predict(
          tf.tensor2d(observations, [1, observations.length])
        );
      });

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
