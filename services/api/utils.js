/* eslint-disable no-param-reassign */
/* eslint-disable no-mixed-operators */
const ffmpeg = require('fluent-ffmpeg');

/* ### Math utils ### */

/**
 * Compute the Greatest Common Divisor of two integers using the Euclidean algorithm
 * @param {number} a An integer
 * @param {number} b Another integer
 * @returns The GCD of a and b
 */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/**
 * Shuffle an array using the Fisher-Yates algorithm (https://stackoverflow.com/a/2450976/5838789)
 * @param {Array} array
 * @returns The shuffled array
 */
const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

/**
 * Compute the count and size of squares
 * @param {number} width Media width
 * @param {number} height Media height
 * @param {number} n The targeted square count
 * @returns Count and size of squares
 */
const getFormat = (width, height, n) => {
  // Maximum square size
  const maxs = gcd(width, height);
  // Minimum square count
  const minc = width * height / (maxs * maxs);
  const coef = Math.round(Math.sqrt(Math.round(n / minc)));
  return { count: coef * coef * minc, size: maxs / coef };
};

/* ### Media utils ### */

/**
 * Get media metadata from path
 * @param {string} input Media path
 * @returns Media metadata
 */
const getMediaData = (input) => new Promise((resolve, reject) => {
  ffmpeg(input)
    .ffprobe(0, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
});

/**
 * Get media dimensions from its metadata
 * @param {ffmpeg.FfprobeData} metadata Media metadata
 * @returns Media dimensions
 */
const getVideoDimensions = ({ streams }) => new Promise((resolve, reject) => {
  // eslint-disable-next-line camelcase
  const videoStreams = streams.filter(({ codec_type }) => codec_type === 'video');
  if (videoStreams.length === 0) reject(new Error('No video data found.'));
  else resolve({ width: videoStreams[0].width, height: videoStreams[0].height });
});

/**
 * Generates the partially hidden video
 * @param {string} input Media input path
 * @param {string} output Media output path
 * @param {number} n The targeted square count
 * @param {number} m The hidden parts count
 */
const generateVideo = (input, output, n = 2000, m = 1000) => {
  getMediaData(input)
    .then((mediaData) => getVideoDimensions(mediaData))
    .then(({ width, height }) => {
      // Computes the squares
      const { count, size } = getFormat(width, height, n);
      const ids = shuffle([...Array(count).keys()]).slice(count - m);
      // Draw squares
      const maxi = width / size;
      const res = { command: ffmpeg(input) };
      ids.forEach((id) => {
        res.command = res.command.videoFilters({
          filter: 'drawbox',
          options: {
            x: (id % maxi) * size,
            y: Math.floor(id / maxi) * size,
            w: size,
            h: size,
            color: 'black@1',
            t: 'max',
          },
        });
      });
      // Use the run() method to run commands
      res.command
        .output(output)
        .on('end', () => {
          // eslint-disable-next-line no-console
          console.log('The video is generated!');
          // eslint-disable-next-line no-console
          console.log('The video is generated!');
        })
        .run();
    })
    .catch((err) => console.error(err));
};

module.exports = { generateVideo };
