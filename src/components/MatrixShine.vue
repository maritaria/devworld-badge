<script setup>
import {ref, watchEffect} from "vue";
import {useRafFn, useResizeObserver} from "@vueuse/core";

// Based on https://codepen.io/yaclive/pen/EayLYO

const props = defineProps({
  fontSize: {default: 10},
});

/** @type {{value: HTMLCanvasElement | null}} */
const $canvas = ref(null);
const $ctx = ref(null);

/** @type {{x: number,y:number,chars:string[],next:number,step:number, maxLength:number,}[]} */
const columns = [];

watchEffect(() => {
  if (!$canvas.value) return;
  $ctx.value = $canvas.value.getContext('2d');
});

useRafFn(({timestamp}) => {
  if (!$ctx.value) return;
  render($ctx.value, timestamp);
});

/** @param {CanvasRenderingContext2D} ctx */
function render(ctx, timestamp) {
  const {canvas} = ctx;
  const {fontSize} = props;
  const maxY = Math.floor(canvas.height / fontSize);

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

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `bold ${fontSize * 1.2}px monospace`;

  // Render
  for (const col of columns) {
    const x = col.x * fontSize;
    for (const [dy, char] of col.chars.entries()) {
      const y = (col.y - dy) * fontSize;
      const [r, g, b] = colorDroplet(dy, col);
      ctx.fillStyle = `rgb(${r},${g},${b}`;
      ctx.fillText(char, x, y);
    }
  }
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
function letter() {
  return alphabet[Math.floor(rand(0, alphabet.length))];
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function arr(length, fn) {
  return Array.from({length}, (_, i) => fn(i));
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
  const body = [0, 255, 0];
  const tail = [0, 0, 0];
  const headLength = Math.clamp(col.maxLength / 3, 3, 10);
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

useResizeObserver($canvas, (entries) => {
  if (!$canvas.value) return;
  $canvas.value.width = $canvas.value.clientWidth;
  $canvas.value.height = $canvas.value.clientHeight;
  const columnCount = $canvas.value.width / props.fontSize;
  if (columns.length > columnCount) {
    const tooMany = columns.length - columnCount;
    columns.splice(columns.length - tooMany, tooMany);
  } else if (columns.length < columnCount) {
    const tooFew = columnCount - columns.length;
    columns.push(...arr(tooFew, x => {
      return {
        x: columns.length + x, y: 0,
        chars: [],
        maxLength: 20,
        next: 0,
        step: 30,
      };
    }));
  }
});

</script>

<template>
  <div class="matrix-shine">
    <canvas ref="$canvas" />
  </div>
</template>

<style scoped>
.matrix-shine {
  mix-blend-mode: overlay;
  mix-blend-mode: plus-lighter;
  position: relative;
}

canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
