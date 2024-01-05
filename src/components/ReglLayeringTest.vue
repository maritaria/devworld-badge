<script setup>
import {computed, onMounted, reactive, ref, unref, watch, watchEffect} from "vue";
import createREGL from "regl";
import {loadTexture} from "../regl/utilities.js";
import {linearGradientLength} from "../linear-gradient.js";
import badgeImg from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import maskUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";
import {Vec2} from "../Vec2.js";
import {clamp, computedAsync, noop} from "@vueuse/core";
import {loadCardResources, makeCardRenderer} from "../regl/card-renderer.js";
import {useMousePosition} from "../vue/use-mouse-position.js";
import {useRegl} from "../vue/use-regl.js";

const pxRatio = window.devicePixelRatio;

const $canvas = ref(null);

const {mouse, onMouseMove, onMouseLeave} = useMousePosition();

const $regl = useRegl($canvas, {
  width: 400,
  height: 564,
  attributes: {
    // Needed for the corner renderer, as it only affects the alpha channel.
    premultipliedAlpha: false,
  },
});

const $render = computedAsync(async () => {
  const regl = unref($regl);
  if (!regl) return;
  const res = await loadCardResources(regl);
  const drawCard = makeCardRenderer(regl, {width: 400, height: 564});
  return function Render(props = {}) {
    regl.clear({depth: 1});
    drawCard({
      ...res,
      mouse: props.mouse ?? [1, 1],
    });
  };
}, noop);

watchEffect(() => {
  const render = unref($render);
  const pos = new Vec2(mouse.x, mouse.y);
  const posViewSpace = pos.multiply(2).subtract(1);
  render({mouse: [posViewSpace.x, -posViewSpace.y]});
  applyTilt(window.app, pos.multiply(100).round(1));
});

</script>

<template>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" @pointermove.capture="onMouseMove" />
</template>

<style scoped>
canvas {
  touch-action: none;
}
</style>
