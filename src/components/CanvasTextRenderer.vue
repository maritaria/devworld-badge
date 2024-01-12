<script setup>
import {computed, ref, unref, watchEffect} from "vue";

/** @type {import('vue').Ref<string>} */
const $text = ref('Hello, world!');
/** @type {import('vue').Ref<HTMLCanvasElement|null>} */
const $canvas = ref(null);
/** @type {import('vue').ComputedRef<CanvasRenderingContext2D|null>} */
const $ctx = computed(() => $canvas.value?.getContext('2d') ?? null);

watchEffect(() => {
  const ctx = unref($ctx);
  if (!ctx) return;
  const text = unref($text);

  const fontSize = 40;
  const shadowBlur = 5;
  const padding = shadowBlur;

  function configure() {
    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'deepskyblue';
    ctx.shadowBlur = shadowBlur;
  }

  configure();
  const info = ctx.measureText(text);
  const left = info.actualBoundingBoxLeft;
  const right = info.actualBoundingBoxRight;
  const top = info.actualBoundingBoxAscent;
  const bottom = info.actualBoundingBoxDescent;
  const width = left + right;
  const height = top + bottom;

  ctx.canvas.width = width + padding * 2;
  ctx.canvas.height = height + padding * 2;

  configure();
  ctx.fillText(text, padding + left, padding + top);
  ctx.fillText(text, padding + left, padding + top);
  ctx.fillText(text, padding + left, padding + top);
  ctx.fillText(text, padding + left, padding + top);
  ctx.fillText(text, padding + left, padding + top);
});

</script>

<template>
  <label>
    Text: <input type="text" v-model="$text">
  </label>
  <br>
  <canvas ref="$canvas" />
</template>

