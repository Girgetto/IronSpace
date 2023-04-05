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
  this.normalizationData = [];
}

// processing the data
TF.prototype.processData = function (data) {
  let processedData = [];
  for (let i = 0; i < data.length; i++) {
    let observation = data[i][0];
    let action = data[i][1];
    let reward = data[i][2];
    let nextObservation = data[i][3];
    let processedObservation = [];
    for (let j = 0; j < observation.length; j++) {
      processedObservation.push(
        (observation[j] - this.normalizationData[j][0]) /
          (this.normalizationData[j][1] - this.normalizationData[j][0])
      );
    }
    processedData.push([processedObservation, action, reward, nextObservation]);
  }
  return processedData;
};

// reseting the game
TF.prototype.reset = function () {
  this.spaceship.x = this.spaceship.ctx.canvas.width / 2;
  this.spaceship.y = this.spaceship.ctx.canvas.height / 2;
  this.spaceship.angle = 0;
  this.spaceship.speed = 0;
  this.spaceship.dx = 0;
  this.spaceship.dy = 0;
  this.spaceship.firstClick = true;
};

// getting the reward
TF.prototype.getReward = function (observation) {
  let reward = 0;
  if (observation[0] > 0.5) {
    reward = 1;
  } else if (observation[0] < 0.5) {
    reward = -1;
  }
  return reward;
};

// getting the observation
TF.prototype.getObservation = function () {
  let observation = [];
  observation.push(this.spaceship.x / this.spaceship.ctx.canvas.width);
  observation.push(this.spaceship.y / this.spaceship.ctx.canvas.height);
  return observation;
};

// playing the game
TF.prototype.play = function () {
  this.stepCounter++;
  this.spaceship.throttle = true;
  let action = this.moves[Math.floor(Math.random() * this.moves.length)];
  this.spaceship.move(action);
  let observation = this.getObservation();
  let reward = this.getReward(observation);
  gameMemory.push([prevObservation, action, reward, observation]);
  prevObservation = observation;
  if (this.stepCounter >= goalSteps) {
    this.gameCounter++;
    this.stepCounter = 0;
    this.reset();
    this.startGame();
    this.processData(
      gameMemory.map((item) => {
        return [item[0], item[1], item[2], item[3]];
      })
    );
  }
};

// traning the model
TF.prototype.train = function () {
  if (this.gameCounter < initialGames) {
    this.play();
  } else {
    this.clearInterval();
    this.linearModel = tf.sequential();
    this.linearModel.add(
      tf.layers.dense({
        inputShape: [2],
        units: 1,
        activation: "sigmoid",
      })
    );
    this.linearModel.compile({
      loss: "meanSquaredError",
      optimizer: tf.train.adam(0.06),
    });
    this.neuralNetworkModel();
  }
};

TF.prototype.normalizeData = function () {
  if (this.trainingData.length === 0) return;
  let temp = [];
  for (let i = 0; i < this.trainingData[0][0].length; i++) {
    temp.push([]);
  }
  for (let i = 0; i < this.trainingData.length; i++) {
    for (let j = 0; j < this.trainingData[i][0].length; j++) {
      temp[j].push(this.trainingData[i][0][j]);
    }
  }
  for (let i = 0; i < temp.length; i++) {
    let min = Math.min(...temp[i]);
    let max = Math.max(...temp[i]);
    this.normalizationData[i] = [min, max];
  }
};

// create neural Network Model
TF.prototype.neuralNetworkModel = function () {
  this.normalizeData();
  let model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [7],
      activation: "sigmoid",
      units: 8,
    })
  );
  model.add(
    tf.layers.dense({
      activation: "sigmoid",
      units: 8,
    })
  );
  model.add(
    tf.layers.dense({
      activation: "sigmoid",
      units: 2,
    })
  );
  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(0.06),
  });
  let trainingData = tf.tensor2d(
    this.trainingData.map((item) => item[0]),
    [this.trainingData.length, 7]
  );
  let outputData = tf.tensor2d(
    this.trainingData.map((item) => item[1]),
    [this.trainingData.length, 2]
  );
  model.fit(trainingData, outputData, { epochs: 50 }).then((history) => {
    this.linearModel = model;
    this.startGame();
  });
};

TF.prototype.trainModel = function () {
  console.log("training model");
  if (this.linearModel === null) return;
  if (
    this.stepCounter < goalSteps &&
    this.game.score > 0 &&
    this.game.level > 0
  ) {
    let observations = [
      parseInt(this.spaceship.posX) / 100,
      parseInt(this.spaceship.posY) / 100,
      parseInt(this.game.goal.posY) / 100,
      parseInt(this.game.goal.posY) / 100,
      parseInt(this.spaceship.dx) / 100,
      parseInt(this.spaceship.dy) / 100,
      parseInt(this.spaceship.angle) / 100,
    ];

    let xs = tf.tensor2d(observations, [1, observations.length]);
    let ys = this.linearModel.predict(xs);
    let y = ys.dataSync();
    let move = y[0] > y[1] ? 0.1 : -0.1;
    this.spaceship.angle += move;
    this.spaceship.throttle = true;
    this.stepCounter++;
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

  console.log(this.linearModel);
};
