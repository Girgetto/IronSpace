const goalSteps = 10;
const scoreRequirement = 1;
const initialGames = 100;

function startTs(resetPlayer, startGame, applyCommands) {
  function someRandomGame() {
    for (let index = 0; index < 5; index++) {
      resetPlayer();
      for (let j = 0; j <= goalSteps; j++) {
        angle = Math.random() * (6 - 0);
        let { isOver, reward } = applyCommands(angle);
        if (isOver) break;
      }
    }
  }
  //someRandomGame();

  function initialPopulation() {
    let trainingData = [];
    let scores = [];
    let acceptedScores = [];
    for (let i = 0; i < initialGames; i++) {
      let score = 0;
      let gameMemory = [];
      let prevObservation = [];
      startGame();
      for (let index = 0; index < goalSteps; index++) {
        angle = Math.random() * (6 - 0);

        let { isOver, reward } = applyCommands(angle);

        if (prevObservation.length > 0) {
          gameMemory.push([prevObservation, angle]);
        }

        prevObservation = [reward, angle];
        score += reward;
      }
      if (score >= scoreRequirement) {
        acceptedScores.push(score);
        gameMemory.forEach((data) => {
          trainingData.push([data[0], data[1]]);
        });
        scores.push(score);
      }
    }
    trainingDataSave = trainingData;
    console.log(
      "Average accepted score " +
        acceptedScores.reduce((a, b) => a + b, 0) / acceptedScores.length
    );
    console.log("Median accepted score " + median(acceptedScores));
    console.log(acceptedScores.length);
    return trainingData;
  }

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

  function neuralNetworkModel(inputSize) {
    const input = tf.input({ shape: [1] });

    const dense1 = tf.layers
      .dense({ units: 4, activation: "relu" })
      .apply(input);
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
  }

  function trainModel(trainingData, model) {
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
  }

  trainModel(initialPopulation());
}
