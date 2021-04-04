/* eslint-disable no-console */
const express = require('express');
const generatePreview = require('./image');

const app = express();
const port = 8000;

app.use('/static', express.static('./public'));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

const data = {
  width: 1920,
  height: 1080,
  col: 64,
  row: 36,
  cells: {
    0: {
      // last year
      data: Date.now() - 31536000000,
      buyer: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    },
    2159: {
      // last year
      data: Date.now() - 31536000000,
      buyer: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    },
    2000: {
      // a month ago
      data: Date.now() - 2592000000,
      buyer: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    },
    2037: {
      // right now
      data: Date.now(),
      buyer: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    },
  },
};
generatePreview(data);
