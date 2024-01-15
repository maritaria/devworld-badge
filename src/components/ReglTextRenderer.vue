<script setup>
import {computed, ref, toValue, unref, watchEffect} from "vue";
import {makeOffscreenCanvas} from "../canvas.js";
import {useRegl} from "../vue/use-regl.js";
import {useReglTexture} from "../vue/use-regl-texture.js";
import {noop} from "@vueuse/core";
import {makeTextureRenderer} from "../regl/texture-renderer.js";
import {useReglTextSurface} from "../vue/use-regl-text-surface.js";

const $text = ref('Hello, world!');
const $canvas = ref(null);
const $regl = useRegl($canvas, {width: 300, height: 100, attributes: {premultipliedAlpha: false}});

/** @param {CanvasRenderingContext2D} ctx */
function configureSurface(ctx) {
  ctx.font = `40px monospace`;
  ctx.fillStyle = 'white';
  ctx.shadowColor = 'deepskyblue';
  ctx.shadowBlur = 5;
}

const [$surface] = useReglTextSurface($regl, $text, {
  font: '40px monospace',
  shadowBlur: 5,
  shadowColor: 'deepskyblue',
  shadowRepeats: 5,
});

const $render = computed(() => {
  const regl = unref($regl);
  if (!regl) return noop;
  const drawTexture = makeTextureRenderer(regl);
  return (texture) => texture && drawTexture({texture});
});

watchEffect(() => {
  $render.value?.($surface.value);
});

</script>

<template>
  <label>
    Text: <input type="text" v-model="$text">
  </label>
  <br>
  <canvas ref="$canvas" />
</template>
