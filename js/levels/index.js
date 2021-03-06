/* eslint-disable no-unused-vars */
const level1 = {
  goal: { posX: 100, posY: 100 },
  planets: [{ posX: 500, posY: 500, radius: 50, density: Math.pow(10, 8) }],
};

const level2 = {
  goal: { posX: 900, posY: 500 },
  planets: [
    { posX: 800, posY: 500, radius: 50, density: Math.pow(10, 8) },
    { posX: 500, posY: 100, radius: 70, density: Math.pow(10, 8) },
  ],
};

const level3 = {
  goal: { posX: 1000, posY: 500 },
  planets: [
    { posX: 800, posY: 500, radius: 80, density: Math.pow(10, 8) },
    { posX: 500, posY: 300, radius: 70, density: Math.pow(10, 8) },
  ],
};

const level4 = (ctx) => ({
  goal: { posX: ctx.canvas.width / 2, posY: ctx.canvas.height / 2 },
  planets: [
    { posX: 600, posY: 200, radius: 80, density: Math.pow(10, 8) },
    { posX: 400, posY: 350, radius: 60, density: Math.pow(10, 8) },
    { posX: 500, posY: 600, radius: 70, density: Math.pow(10, 8) },
  ],
});
