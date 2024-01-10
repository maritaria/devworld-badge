<script setup>
import {useRegl} from "../vue/use-regl.js";
import {ref, unref} from "vue";
import {computedAsync, useRafFn} from "@vueuse/core";
import {makeTextureRenderer} from "../regl/texture-renderer.js";
import {makeOffscreenCanvas} from "../canvas.js";
import {makeMatrixRainRenderer} from "../regl/matrix-rain-renderer.js";

const $canvas = ref(null);
const $regl = useRegl($canvas, {
  width: 400,
  height: 500,
  attributes: {
    alpha: true,
    premultipliedAlpha: false,
  },
});
const $render = computedAsync(async () => {
  const regl = unref($regl);
  if (!regl) return;
  const paint = makeTextureRenderer(regl);
  const canvas = makeOffscreenCanvas(400, 500);
  const render = makeMatrixRainRenderer(canvas);
  const texture = regl.texture(canvas);
  return (delta) => {
    render(delta);
    texture.subimage(canvas);
    paint({
      texture,
    });
  };
});

useRafFn(({delta}) => {
  $render.value?.(delta);
});
</script>

<template>
  <canvas ref="$canvas" />
</template>

<style scoped>

</style>
