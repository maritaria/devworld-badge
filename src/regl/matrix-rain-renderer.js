import {makeOffscreenCanvas} from "../canvas.js";
import {clamp} from "@vueuse/core";

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

export function makeMatrixRainRenderer(canvas, fontSize = 10) {

  /** @type {CanvasRenderingContext2D|null} */
  const ctx = canvas.getContext('2d');
  if (ctx === null) throw new Error('Failed to obtain "2d" context');

  let prevWidth = 0;
  let prevHeight = 0;

  // State
  let columns = [];
  let timestamp = 0;
  return function renderMatrixRain(delta = 1 / 60) {
    let {width, height} = canvas;
    if (width !== prevWidth || height !== prevHeight) {
      columns = initColumns(width, height, fontSize);
      prevWidth = width;
      prevHeight = height;
    }
    timestamp += delta;
    const maxY = Math.floor(height / fontSize);

    // Update columns
    for (const col of columns) {
      if (col.next < timestamp) {
        col.next = timestamp + col.step;
        col.y++;
        col.chars.unshift(letter());
        if (col.chars.length > col.maxLength) {
          col.chars.splice(col.maxLength, col.chars.length);
        }

        if (col.y - col.chars.length > maxY) {
          if (Math.random() < 0.05) {
            initRay(col);// Last char has dropped off, reset the column
          }
        }
      }
    }

    // Init render state
    ctx.reset();
    ctx.globalAlpha = 0.8;
    // Disabled to optimize rendering time
    // ctx.shadowBlur = 5;
    // ctx.shadowColor = 'lightgreen';
    ctx.font = `bold ${fontSize * 1.2}px monospace`;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Render
    for (const col of columns) {
      const x = col.x * fontSize;
      for (const [dy, char] of col.chars.entries()) {
        const y = (col.y - dy) * fontSize;
        const [r, g, b] = colorDroplet(dy, col);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillText(char, x, y);
      }
    }
  }
}

function letter() {
  return alphabet[Math.floor(rand(0, alphabet.length))];
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function initRay(obj) {
  obj.y = 0;
  obj.chars = [];
  obj.maxLength = ~~rand(15, 40);
  obj.next = 0;
  obj.step = ~~(1000 / obj.maxLength);
}

function colorDroplet(y, col) {
  const head = [255, 255, 255];
  const body = [50, 255, 0];
  const tail = [0, 0, 0];
  if (y <= 0) return head;
  if (y < 5) {
    return lerpColor(y / 5, head, body);
  }
  const tailLength = 5;
  const tailStart = col.maxLength - tailLength;
  if (y >= tailStart) {
    const tailY = y - tailStart;
    return lerpColor(tailY / tailLength, body, tail);
  }
  return body;
}

function lerpColor(factor, start, end) {
  return [
    lerp(factor, start[0], end[0]),
    lerp(factor, start[1], end[1]),
    lerp(factor, start[2], end[2]),
  ];
}

function lerp(factor, start, end) {
  const range = end - start;
  return start + (range * factor);
}

/**
 * @param {number} width
 * @return {{x: number,y:number,chars:string[],next:number,step:number, maxLength:number,}[]}}
 */
function initColumns(width, height, fontSize) {
  return Array.from({length: width / fontSize}, (_, index) => ({
    x: index, y: Math.floor(-rand(0, height / fontSize * 2)),
    chars: [],
    maxLength: 20,
    next: 0,
    step: 30,
  }));
}
