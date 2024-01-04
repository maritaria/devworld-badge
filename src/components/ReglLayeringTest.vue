<script setup>
import {computed, onMounted, reactive, ref, watchEffect} from "vue";
import createREGL from "regl";
import {loadTexture} from "../regl/utilities.js";
import {linearGradientLength} from "../linear-gradient.js";
import badgeImg from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import maskUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";
import {Vec2} from "../Vec2.js";
import {clamp} from "@vueuse/core";
import {loadCardResources, makeCardRenderer} from "../regl/card-renderer.js";
import {useMousePosition} from "../vue/use-mouse-position.js";

const pxRatio = window.devicePixelRatio;

const $canvas = ref(null);
const size = reactive({width: 400 * 1, height: 564 * 1});
const rsize = computed(() => ({
  width: size.width * pxRatio,
  height: size.height * pxRatio,
}));

const {mouse, onMouseMove, onMouseLeave} = useMousePosition();
const render = ref(null);

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 */
function adjustCanvasSize(canvas, width, height) {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = width * pxRatio;
  canvas.height = height * pxRatio;
}

onMounted(async () => {
  if (!$canvas.value) throw Error("Missing ref($canvas)");

  adjustCanvasSize($canvas.value, size.width, size.height);

  const regl = createREGL({
    canvas: $canvas.value,
    attributes: {
      alpha: true,
      premultiplyAlpha: false,
      powerPreference: 'high-performance',
    },
  });
  // TODO: Make this faster, precompute the blur mask outside of GPU.
  // TODO: Handle context loss (for mobile)
  // TODO: Pre-bake the neon fade, to skip rendering it on the GPU at all.
  // TODO: Render blur using svg inlining trick
  // TODO: Offset mouse point using device sensors

  const res = await loadCardResources(regl);
  const drawCard = makeCardRenderer(regl);

  render.value = (props = {}) => {
    regl.clear({depth: 1});
    drawCard({
      ...res,
      mouse: props.mouse ?? [1, 1],
    });
  };
  render.value();
});

watchEffect(() => {
  if (!render.value) return;
  const pos = new Vec2(mouse.x, mouse.y);
  const posViewSpace = pos.multiply(2).subtract(1);
  render.value({mouse: [posViewSpace.x, -posViewSpace.y]});
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
