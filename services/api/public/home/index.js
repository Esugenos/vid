/* eslint-disable no-mixed-operators */
/* eslint-disable no-console */

const main = document.getElementById('main');

/**
 * Create tile element
 * @returns Tile element
 */
const createTile = () => {
  const el = document.createElement('div');
  el.classList.add('preview-tile');
  el.classList.add('shadow');
  return el;
};

let prevX = -1;
let prevY = -1;
let el;
let triggered = false;

/**
 * Update tile style (position and size)
 */
const updateTileStyle = (hcount, vcount, mousePos, mainRect) => {
  if (triggered) return;
  const { clientX, clientY } = mousePos;
  const {
    left, top, width, height,
  } = mainRect.getBoundingClientRect();
  const x = Math.floor((clientX - left) / width * hcount);
  const y = Math.floor((clientY - top) / height * vcount);
  if (x < 0 || y < 0 || x > hcount - 1 || y > vcount - 1) return;
  if (x !== prevX || y !== prevY) {
    const tmpEl = el;
    setTimeout(() => {
      if (tmpEl && tmpEl.parentNode && !tmpEl.classList.contains('opaque')) tmpEl.parentNode.removeChild(tmpEl);
    }, 1000);
    el = createTile();
    mainRect.appendChild(el);
    prevX = x;
    prevY = y;
  } else {
    return;
  }
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
  const unTrigger = (instance) => {
    el.classList.add('no-shadow');
    el.classList.remove('opaque');
    el.classList.remove('shadow');
    const tmpEl = el;
    setTimeout(() => {
      if (tmpEl && tmpEl.parentNode) tmpEl.parentNode.removeChild(tmpEl);
    }, 1000);
    triggered = false;
    if(instance) instance.hide();
  }
  // eslint-disable-next-line no-undef
  tippy(el, {
    content: `<div style="background-image: url('/public/base-full.png'); display:'block'; width:${zoom * width / hcount}px; height:${zoom * height / vcount}px; background-size: ${100 * hcount}%; image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; background-position: left ${-zoom * x * width / hcount}px top ${-zoom * y * height / vcount}px;"></div> <p class="numero">#${1 + x + y * hcount}</p>`,
    theme: 'custom',
    arrow: false,
    placement: 'right',
    offset: [0, 36],
    allowHTML: true,
    trigger: 'click',
    onTrigger() {
      if(triggered) {
        unTrigger(null);
        return;
      }
      el.classList.add('shadow');
      el.classList.add('opaque');
      el.classList.remove('no-shadow');
      triggered = true;
    },
    onUntrigger(instance, event) {
      unTrigger(instance);
    },
    onClickOutside(instance) {
      unTrigger(instance);
    },
  });
};

const hcount = 64;
const vcount = 36;
main.addEventListener('mousemove', (e) => updateTileStyle(hcount, vcount, e, main));
window.addEventListener('resize', (e) => updateTileStyle(hcount, vcount, e, main));

// Update counter
fetch('/count').then((res) => res.json()).then(({ count }) => {
  document.getElementById('counter').innerHTML = `${count.toString().padStart(4, '0')}/2304`;
});
