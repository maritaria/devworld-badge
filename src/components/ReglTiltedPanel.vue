<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {mat4, quat, vec3} from "gl-matrix";
import {initCanvas, loadTexture} from "../regl/utilities.js";
import {elements, position, uv} from "../card.data.js";
import textureUrl from "../assets/doc/linkedin-black-friday-sale.png";
import Slider from "./Slider.vue";
import {Vec2} from "../Vec2.js";
import {makeTiltedPanelRenderer} from "../regl/panel-renderer.js";
import {useMousePosition} from "../vue/use-mouse-position.js";
import {useSpring} from "../vue/use-spring.js";

const $settings = reactive({
  canvas: {width: 400, height: 500},
  panel: new Vec2(400, 500).normalized(),
  distance: 1.3,
});

const $canvas = ref(null);

const {mouse, onMouseMove, onMouseLeave} = useMousePosition();
const $tilt = useCardTilt(mouse);
const $distance = useSpring(() => $settings.distance * (mouse.hover ? 0.9 : 1));

onMounted(async () => {
  if (!$canvas.value) throw new Error('Missing $canvas');
  const regl = initCanvas($canvas.value, $settings.canvas);
  const texture = await loadTexture(regl, textureUrl, {flipY: true});
  const drawPanel = makeTiltedPanelRenderer(regl);

  regl.frame(function renderFrame() {
    regl.clear({color: [0, 0, 0, 1], depth: 1});
    drawPanel({
      distance: $distance.value,
      tilt: $tilt.value,
      texture,
      scale: $settings.panel,
    });
  });
});

function useCardTilt(mouse) {
  const tilt = computed(() => {
    // Tilt is expressed in degrees
    const m = Vec2.fromObject(mouse);
    const tilt = m.multiply(100).subtract(50);
    return {
      x: tilt.y / 2,
      y: tilt.x / 1.5,
    };
  });
  const springX = useSpring(() => tilt.value.x);
  const springY = useSpring(() => tilt.value.y);
  return computed(() => {
    return {
      x: springX.value,
      y: springY.value,
    };
  });
}

</script>

<template>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" />
  <Slider label="distance" v-model="$settings.distance" :min="0" :max="5" :step=".05" />
</template>

<style scoped>

</style>
