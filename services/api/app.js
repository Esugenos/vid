/* eslint-disable no-console */
const express = require('express');
const { generateVideo } = require('./utils');

const app = express();
const port = 8000;

app.use('/static', express.static('/public'));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

generateVideo('/public/original.mp4', '/public/ntsh.mp4');
