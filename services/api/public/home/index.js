/* eslint-disable no-mixed-operators */
/* eslint-disable no-console */

const main = document.getElementById('main');

/**
 * Create tile element
 * @returns Tile element
 */
const createTile = () => {
  const el = document.createElement('div');
  el.setAttribute('class', 'preview-tile');
  return el;
};

let prevX = -1;
let prevY = -1;
let el;
/**
 * Update tile style (position and size)
 */
const updateTileStyle = (hcount, vcount, mousePos, mainRect) => {
  const { clientX, clientY } = mousePos;
  const {
    left, top, width, height,
  } = mainRect.getBoundingClientRect();
  const x = Math.floor((clientX - left) / width * hcount);
  const y = Math.floor((clientY - top) / height * vcount);
  if (x < 0 || y < 0 || x > hcount - 1 || y > vcount - 1) return;
  if (x !== prevX || y !== prevY) {
    const tmpEl = el;
    setTimeout(() => { if (tmpEl && tmpEl.parentNode) tmpEl.parentNode.removeChild(tmpEl); }, 1000);
    el = createTile();
    mainRect.appendChild(el);
    prevX = x;
    prevY = y;
  }
  console.log(100 * width / 1920);
  const style = `
    position: absolute;
    width: ${width / hcount}px;
    height: ${height / vcount}px;
    left: ${left + x * width / hcount}px;
    top: ${top + y * height / vcount}px;
    background-size: ${100 * hcount}%;
    background-position: left ${-x * width / hcount}px top ${-y * height / vcount}px;
  `;
  el.setAttribute('style', style);
  const zoom = 18;
  tippy(el, {
    // content: `<div style="background-image: url("./base.png"); ${style};"></div>`,
    content: `<div style="background-image: url('./base.png'); display:'block'; width:${zoom * width / hcount}px; height:${zoom * height / vcount}px; background-size: ${100 * hcount}%; image-rendering: pixelated; background-position: left ${-zoom * x * width / hcount}px top ${-zoom * y * height / vcount}px;"></div> #${y + x * vcount}`,
    theme: 'custom',
    arrow: false,
    placement: 'right',
    offset: [0, 36],
    allowHTML: true,
  });
};

const hcount = 64;
const vcount = 36;
// const hcount = 16;
// const vcount = 9;
main.addEventListener('mousemove', (e) => updateTileStyle(hcount, vcount, e, main));
window.addEventListener('resize', (e) => updateTileStyle(hcount, vcount, e, main));

// tippy('.preview-tile', {
//   content: '<span class="tooltip-span">Features of this tooltip:</span><ul><li>I have a list inside</li><li>I am on the right</li></ul>',
//   theme: 'custom',
//   arrow: false,
//   placement: 'right',
// });
