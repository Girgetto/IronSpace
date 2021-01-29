/* eslint-disable no-unused-vars */
const goalSteps = 100;
const scoreRequirement = 2;
const initialGames = 5;

function TF(spaceship, clearInterval, game, reset) {
  this.spaceship = spaceship;
  this.clearInterval = clearInterval;
  this.game = game;
  this.reset = reset;
  this.stepCounter = 0;
  this.gameCounter = 0;
  this.moves = [-0.1, 0.1, 0];
}

TF.prototype.someRandomGame = function () {
  if (this.stepCounter < goalSteps && score > 0) {
    this.spaceship.angle += this.moves[Math.floor(Math.random() * (2 - 0))];
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

let trainingData = [];
let scores = [];
let acceptedScores = [];
let prevObservation = [];
let score = 0;
let gameMemory = [];
TF.prototype.initialPopulation = function () {
  if (this.stepCounter < goalSteps && this.game.score > 0) {
    this.spaceship.angle += this.moves[Math.floor(Math.random() * (2 - 0))];
    this.spaceship.throttle = true;
    this.stepCounter++;
    if (prevObservation.length > 0) {
      gameMemory.push([prevObservation, this.spaceship.angle]);
    }

    prevObservation = [this.game.score, this.game.angle];
    score = this.game.level;
  } else if (this.gameCounter < initialGames) {
    this.reset();
    this.gameCounter++;
    this.stepCounter = 0;
    this.game.level = 1;
    let prevObservation = [];
    if (score >= scoreRequirement) {
      acceptedScores.push(score);
      gameMemory.forEach((data) => {
        trainingData.push([data[0], data[1]]);
      });
      scores.push(score);
    }
  } else {
    console.log(
      "Average accepted score " +
        acceptedScores.reduce((a, b) => a + b, 0) / acceptedScores.length
    );
    console.log("Median accepted score " + median(acceptedScores));
    console.log(acceptedScores.length);
    console.log(trainingData);
    clearInterval();
  }
};

//initialPopulation();

function median(values) {
  if (values.length === 0) return 0;

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

TF.prototype.neuralNetworkModel = function (inputSize) {
  const input = tf.input({ shape: [1] });

  const dense1 = tf.layers.dense({ units: 4, activation: "relu" }).apply(input);
  const dense2 = tf.layers
    .dense({ units: 1, activation: "softmax" })
    .apply(dense1);
  const network = tf.layers.dropout(dense1, 0.8);
  let model = tf.model({ inputs: input, outputs: dense2 });
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  // const saveResult = await model.save("./");
  // const model = await tf.loadLayersModel("./");
  model.summary();
  return model;
};

TF.prototype.trainModel = function (trainingData, model) {
  model = neuralNetworkModel(trainingData);

  const xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
  const ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);

  function onBatchEnd(batch, logs) {
    console.log("Accuracy", logs.acc);
  }

  model
    .fit(xs, ys, {
      epochs: 5,
      batchSize: 32,
      callbacks: { onBatchEnd },
    })
    .then((info) => {
      console.log("Final accuracy", info.history.acc);
    });
};

//trainModel(initialPopulation());
