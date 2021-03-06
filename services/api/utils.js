const ffmpeg = require('fluent-ffmpeg');

const getMediaData = (input) => new Promise((resolve, reject) => {
  ffmpeg(input)
    .ffprobe(0, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
});

const getVideoDimensions = ({ streams }) => new Promise((resolve, reject) => {
  const videoStreams = streams.filter(({ codec_type }) => codec_type === 'video');
  if (videoStreams.length === 0) reject("No video data found.");
  else resolve({ width: videoStreams[0].width, height: videoStreams[0].height });
});

const generateVideo = (input, output) => {

  getMediaData(input)
    .then(mediaData => getVideoDimensions(mediaData))
    .then(({ width, height }) => {

    })
    .catch(err => console.error(err));
  
  // Use the run() method to run commands with multiple outputs
  ffmpeg(input)
    .videoFilters({
      filter: 'drawbox',
      options: {
        x: 0,
        y: 0,
        w: 100,
        h: 100,
        color: 'white@1',
        t: 'max'
      }
    })
    .videoFilters({
      filter: 'drawbox',
      options: {
        x: 100,
        y: 100,
        w: 100,
        h: 100,
        color: 'white@1',
        t: 'max'
      }
    })
    .output(output)
    .on('end', () => {
      console.log('The video is generated!');
    })
    .run();
};

module.exports = { generateVideo };