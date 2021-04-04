/* eslint-disable no-plusplus */
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const generatePreview = ({
  width, height, col, row, cells,
}) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const cellWidth = width / col;
  const cellHeight = height / row;

  // Draw the full image, then hide some parts
  loadImage('./base-full.png').then((image) => {
    ctx.drawImage(image, 0, 0, width, height);
    ctx.fillStyle = 'white';
    let lastX = 0;
    let lastY = 0;
    for (let i = 0; i < row; i++) {
      lastX = 0;
      lastY = i * cellHeight;
      for (let j = 0; j < col; j++) {
        if (cells[i + j * row]) {
          ctx.fillRect(lastX, lastY, j * cellWidth - lastX, cellHeight);
          lastX = (j + 1) * cellWidth;
        }
      }
      ctx.fillRect(lastX, lastY, width - lastX, cellHeight);
    }
    const buf = canvas.toBuffer();
    fs.writeFileSync('./public/home/base.png', buf);
  });
};

module.exports = generatePreview;
