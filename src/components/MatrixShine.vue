<script setup>
import {ref, watch, watchEffect} from "vue";
import {useRafFn} from "@vueuse/core";

const props = defineProps({
  fontSize: {default: 10},
});

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const columns = ref(0);
const drops = [];

/** @type {{value: HTMLCanvasElement | null}} */
const $canvas = ref(null);
const $ctx = ref(null);

watch($canvas, canvas => {
  if ($canvas.value) {
    autosizeCanvas($canvas.value);
    $ctx.value = $canvas.value.getContext('2d');
  }
});
watchEffect(() => {
  if (!$canvas.value) return;
  columns.value = $canvas.value.width / props.fontSize;
  drops.splice(0, drops.length, ...Array.from({length: columns.value}, () => ({next: 0, y: 1000, interval: 93})));
});

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function letter() {
  return alphabet[Math.floor(rand(0, alphabet.length))];
}

useRafFn(({timestamp}) => {
  if (!$ctx.value) return;
  render($ctx.value, timestamp);
});

/** @param {CanvasRenderingContext2D} ctx */
function render(ctx, timestamp) {
  const {canvas} = ctx;
  const {fontSize} = props;
  // Darken the already drawn letters
  ctx.fillStyle = 'rgba(0, 0, 0, .02)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'currentColor';
  ctx.font = `${fontSize * 1.2}px monospace`;
  // Draw next droplets
  for (var i = 0; i < drops.length; i++) {
    var text = letter();
    const drop = drops[i];
    if (drop.next < timestamp) {
      drop.next = timestamp + drop.interval;
      drop.y++;
      ctx.fillText(text, i * fontSize, drop.y * fontSize);
      if (drop.y * fontSize > canvas.height && Math.random() > .95) {
        drop.y = 0;
      }
    }
  }
}

/** @param {HTMLCanvasElement} canvas */
function autosizeCanvas(canvas) {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

// Goal:
// 1. Show characters in a grid on the card
// 2. Style the characters with the appearance of the matrix effect
// 3. Fade the characters out when they appear
// 4. Cause vertical trails of characters to appear in the grid

// Based on https://codepen.io/yaclive/pen/EayLYO

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
  color: skyblue;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
