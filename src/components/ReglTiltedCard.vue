<script setup>
import {computed, ref, unref, watchEffect} from 'vue';
import {useRegl} from "../vue/use-regl.js";
import {computedAsync, noop} from "@vueuse/core";
import {loadCardResources, makeCardRenderer} from "../regl/card-renderer.js";
import {useMousePosition} from "../vue/use-mouse-position.js";
import {makeTiltedPanelRenderer} from "../regl/panel-renderer.js";
import {Vec2} from "../Vec2.js";
import {useSpring} from "../vue/use-spring.js";

const $canvas = ref(null);
const cardSize = new Vec2(400, 564);
const $regl = useRegl($canvas, {
  ...cardSize.toSize(),
  attributes: {
    // Needed for the corner renderer, as it only affects the alpha channel.
    premultipliedAlpha: false,
  },
});

const {mouse, onMouseMove, onMouseLeave} = useMousePosition();

const props = useMouseTilt(mouse);

function useMouseTilt(mouse) {
  const tilt = computed(() => {
    // Tilt is expressed in degrees
    const m = Vec2.fromObject(mouse);
    const tilt = m.multiply(100).subtract(50);
    return {
      x: -tilt.y / 2,
      y: -tilt.x / 1.5,
    };
  });
  const springX = useSpring(() => tilt.value.x);
  const springY = useSpring(() => tilt.value.y);
  const distance = useSpring(() => mouse.hover ? 1.15 : 1.3);
  return computed(() => {
    return {
      tilt: {
        x: springX.value,
        y: springY.value,
      },
      distance: distance.value,
    };
  });
}

const $render = computedAsync(async () => {
  const regl = /** @type {REGL.Regl} */ unref($regl);
  if (!regl) return;
  const resources = await loadCardResources(regl);
  const drawCard = makeCardRenderer(regl);
  const drawPanel = makeTiltedPanelRenderer(regl);

  const cardBuffer = regl.framebuffer({
    ...cardSize.multiply(devicePixelRatio).toSize(),
  });

  return function Render({mouse} = {}) {
    // 1. Render the card to a framebuffer
    cardBuffer.use(() => {
      regl.clear({depth: 1});
      drawCard({...resources, mouse});
    });
    // 2. Render the panel with the card on it.
    regl.clear({depth: 1});
    drawPanel({
      tilt: props.value.tilt,
      distance: props.value.distance,
      texture: cardBuffer,
      scale: cardSize.normalized(),
    });
  }
}, noop);

watchEffect((onCleanup) => {
  /** @type {REGL.Regl} */
  const regl = unref($regl);
  const render = unref($render);
  if (regl && render) {
    const handle = regl.frame(() => {
      render({
        // Convert [0..1] screen coords to [-1..1] gl space
        mouse: [
          mouse.x * 2 - 1,
          -(mouse.y * 2 - 1),
        ],
      })
    });
    onCleanup(() => handle.cancel());
  }
});

</script>

<template>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" />
</template>

<style scoped>
canvas {
  touch-action: none;
}
</style>
