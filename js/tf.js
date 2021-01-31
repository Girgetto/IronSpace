/* eslint-disable no-unused-vars */
const goalSteps = 100;
const scoreRequirement = 5000;
const initialGames = 50;

function TF(spaceship, clearInterval, game, reset, goal) {
  this.spaceship = spaceship;
  this.goal = goal;
  this.clearInterval = clearInterval;
  this.game = game;
  this.reset = reset;
  this.stepCounter = 0;
  this.gameCounter = 0;
  this.moves = [-0.1, 0.1];
  this.linearModel = tf.sequential();
  this.trainingData = [];
}

TF.prototype.someRandomGame = function () {
  if (this.stepCounter < goalSteps || score > 0 || this.game.level > 0) {
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

let scores = [];
let acceptedScores = [];
let prevObservation = [];
let score = 0;
let gameMemory = [];
TF.prototype.initialPopulation = function () {
  if (
    this.stepCounter < goalSteps &&
    this.game.score > 0 &&
    this.game.level > 0
  ) {
    move = this.moves[Math.floor(Math.random() * (2 - 0))];
    this.spaceship.angle += move;
    this.spaceship.throttle = true;
    this.stepCounter++;

    if (prevObservation.length > 0) {
      gameMemory.push([
        [
          this.game.goal.posX,
          this.spaceship.posX,
          this.game.goal.posY,
          this.spaceship.posY,
          this.spaceship.angle,
          this.spaceship.dx,
          this.spaceship.dy,
        ],
        move === 0.1 ? [0, 1] : [1, 0],
      ]);
    }

    prevObservation = [
      this.game.goal.posX,
      this.spaceship.posX,
      this.game.goal.posY,
      this.spaceship.posY,
      this.spaceship.angle,
      this.spaceship.dx,
      this.spaceship.dy,
    ];

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
    clearInterval();
    this.neuralNetworkModel(this.trainingData);
  }
};

TF.prototype.neuralNetworkModel = function (trainingData) {
  const inputs = trainingData.map((data) => data[0].map((e) => e));
  const labels = trainingData.map((data) => data[1]);

  const xs = tf.tensor2d(inputs, [inputs.length, 7]);
  const ys = tf.tensor2d(labels, [labels.length, 2]);

  const inputMax = xs.max();
  const inputMin = xs.min();
  const labelMax = ys.max();
  const labelMin = ys.min();

  const normalizedInputs = xs.sub(inputMin).div(inputMax.sub(inputMin));

  const normalizedLabels = ys.sub(labelMin).div(labelMax.sub(labelMin));

  this.linearModel.add(
    tf.layers.dense({ units: 2, inputShape: [inputs[0].length] })
  );
  this.linearModel.compile({
    loss: tf.losses.meanSquaredError,
    optimizer: tf.train.adam(),
    metrics: ["mse"],
  });

  const batchSize = 32;
  const epochs = 50;

  return this.linearModel
    .fit(xs, ys, {
      batchSize,
      epochs,
      callbacks: tfvis.show.fitCallbacks(
        { name: "Training Performance" },
        ["loss", "mse", "acc"],
        { height: 200, callbacks: ["onEpochEnd"] }
      ),
    })
    .then((info) => {
      console.log("Final accuracy", info.history);
      this.linearModel.save("localstorage://my-model").then(() => {
        console.log("saved");
      });
    });
};

TF.prototype.startTrainedModel = function () {
  tf.loadLayersModel("localstorage://my-model").then((model) => {
    tfvis.show.modelSummary({ name: "Model Summary" }, model);
    this.linearModel = model;
    if (this.stepCounter < goalSteps && this.game.score > 0) {
      if (prevObservation.length === 0) {
        move = this.moves[Math.floor(Math.random() * (2 - 0))];
      } else {
        let prediction = this.linearModel.predict(
          tf.tensor2d(
            [
              this.game.goal.posX,
              this.spaceship.posX,
              this.game.goal.posY,
              this.spaceship.posY,
              this.spaceship.angle,
              this.spaceship.dx,
              this.spaceship.dy,
            ],
            [1, 7]
          )
        );
        move = prediction.dataSync()[0] < prediction.dataSync()[1] ? 0.1 : -0.1;
      }
      this.spaceship.angle += move < 0 ? -0.1 : 0.1;
      this.spaceship.throttle = true;
      this.stepCounter++;
      prevObservation = [
        Math.abs(this.game.goal.posX - this.spaceship.posX),
        Math.abs(this.game.goal.posY - this.spaceship.posY),
      ]; // [dPosX, dPosY]
      gameMemory.push([
        prevObservation[0] >
          Math.abs(this.game.goal.posX - this.spaceship.posX) &&
        prevObservation[1] > Math.abs(this.game.goal.posY - this.spaceship.posY)
          ? -move
          : move,
        move,
      ]); // [better move, move took]
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
      clearInterval();
    }
  });
};
