<script setup>
import {computed, ref, toValue, unref, watchEffect} from "vue";
import {makeOffscreenCanvas} from "../canvas.js";
import {useRegl} from "../vue/use-regl.js";
import {useReglTexture} from "../vue/use-regl-texture.js";
import {noop} from "@vueuse/core";
import {makeTextureRenderer} from "../regl/texture-renderer.js";

const $text = ref('Hello, world!');
const $canvas = ref(null);
const $regl = useRegl($canvas, {width: 300, height: 100, attributes: {premultipliedAlpha:false}});

/** @param {CanvasRenderingContext2D} ctx */
function configureSurface(ctx) {
  ctx.font = `40px monospace`;
  ctx.fillStyle = 'white';
  ctx.shadowColor = 'deepskyblue';
  ctx.shadowBlur = 5;
}

const $surface = useReglTextSurface($regl, $text, configureSurface, {repeats: 5});

const $render = computed(() => {
  const regl = unref($regl);
  if (!regl) return noop;
  const drawTexture = makeTextureRenderer(regl);
  return (texture) => texture && drawTexture({texture});
});

watchEffect(() => {
  $render.value?.($surface.value);
});

function useReglTextSurface($regl, $text, configure, {padding = 5, repeats = 1} = {}) {
  const canvas = makeOffscreenCanvas(1, 1);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to create 2d context for useCanvasTextRenderer');

  const $texture = useReglTexture($regl);

  configure(ctx);

  watchEffect(() => {
    const texture = unref($texture);
    if (!texture) return;

    // 1. Measure the text
    const text = toValue($text);
    const {
      actualBoundingBoxAscent: top,
      actualBoundingBoxDescent: bottom,
      actualBoundingBoxLeft: left,
      actualBoundingBoxRight: right,
    } = ctx.measureText(text);

    // 2. Size the canvas
    canvas.width = left + right + padding * 2;
    canvas.height = top + bottom + padding * 2;
    configure(ctx);

    // 3. Render the text to canvas
    for (let i = 0; i < repeats; i++) {
      ctx.fillText(text, padding + left, padding + top);
    }

    // 4. Transfer pixels to the texture
    texture(canvas);
  });
  return $texture;
}

</script>

<template>
  <label>
    Text: <input type="text" v-model="$text">
  </label>
  <br>
  <canvas ref="$canvas" />
</template>
