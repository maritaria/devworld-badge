<script setup>
import {ref, unref, watchEffect} from "vue";
import {useRegl} from "../vue/use-regl.js";
import badgeUrl from '../assets/doc/niki-devworld-badge-sample-3.jpg';
import {loadTexture} from "../regl/utilities.js";
import {makePlusLighterMixer} from "../regl/plus-lighter-mixer.js";
import {makeOffscreenCanvas} from "../canvas.js";
import {makeMatrixRainRenderer} from "../regl/matrix-rain-renderer.js";
import {useRafFn} from "@vueuse/core";

const $canvas = ref(null);
const $regl = useRegl($canvas, {width: 300, height: 300});

watchEffect(async (onCleanup) => {
  const regl = unref($regl);
  if (!regl) return;

  const background = await loadTexture(regl, badgeUrl, {flipY: false});
  const canvas = makeOffscreenCanvas(300, 300);
  const renderRain = makeMatrixRainRenderer(canvas);
  const foreground = regl.texture(300, 300);

  let last = performance.now();
  const updateRain = () => {
    const now = performance.now();
    renderRain(now - last);
    foreground.subimage(canvas);
    last = now;
  };

  const handle = regl.frame(() => {
    updateRain();
    const mixer = makePlusLighterMixer(regl);
    mixer(foreground, background);

  });
  onCleanup(() => handle.cancel());
});

</script>

<template>
  <canvas ref="$canvas" />
</template>

<style scoped>

</style>
