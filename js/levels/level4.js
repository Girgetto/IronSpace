var level4 = (ctx) => ({
  goal: [ctx.canvas.width / 2, ctx.canvas.height / 2],
  planets: [
    { posX: 600, posY: 200, radius: 80, density: Math.pow(10, 8) },
    { posX: 400, posY: 350, radius: 60, density: Math.pow(10, 8) },
    { posX: 500, posY: 600, radius: 70, density: Math.pow(10, 8) },
  ],
});
