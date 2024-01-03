<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {mat4, quat, vec3} from "gl-matrix";
import {initCanvas, loadTexture} from "../regl/utilities.js";
import {elements, position, uv} from "../card.data.js";
import textureUrl from "../assets/doc/linkedin-black-friday-sale.png";
import Slider from "./Slider.vue";
import {Vec2} from "../Vec2.js";
import {useMousePosition} from "../vue-utilities.js";

const $settings = reactive({
  canvas: {width: 400, height: 500},
  panel: new Vec2(400, 500).normalized(),
  distance: 2,
});

const $canvas = ref(null);

const {mouse, onMouseMove, onMouseLeave} = useMousePosition();
const $tilt = useCardTilt(mouse);

onMounted(async () => {
  if (!$canvas.value) throw new Error('Missing $canvas');
  const regl = initCanvas($canvas.value, $settings.canvas);
  const texture = await loadTexture(regl, textureUrl);
  const drawPanel = makePanelRenderer(regl);

  regl.frame(function renderFrame() {
    regl.clear({color: [0, 0, 0, 255], depth: 1});
    drawPanel({
      distance: $settings.distance,
      tilt: $tilt.value,
      texture,
      scale: $settings.panel,
    });
  });
});

function useCardTilt(mouse) {
  return computed(() => {
    // Tilt is expressed in degrees
    const m = Vec2.fromObject(mouse);
    const tilt = m.multiply(100).subtract(50);
    return {
      x: tilt.y / 2,
      y: tilt.x / 1.5,
    };
  });
}

/**
 * @param {REGL.Regl} regl
 * @return {REGL.DrawCommand}
 */
function makePanelRenderer(regl) {
  return regl({
    elements,
    attributes: {
      position,
      uv,
    },
    uniforms: {
      view: ({tick}, props) => {
        const t = 0.01 * tick;
        return mat4.lookAt([],
            [0, 0, props.distance ?? 1],
            [0, 0, 0],
            [0, 1, 0]
        );
      },
      projection: ({viewportWidth, viewportHeight}) =>
          mat4.perspective([],
              Math.PI / 4,
              viewportWidth / viewportHeight,
              0.01,
              10),
      model: (context, props) => props.model ?? mat4.fromRotationTranslationScale(
          [],
          quat.fromEuler([], props.tilt?.x ?? 0, props.tilt?.y ?? 0, 0),
          [0, 0, 0],
          [props.scale?.x ?? 1, props.scale?.y ?? 1, 1],
      ),
      texture: regl.prop('texture'),
    },
    // language=GLSL
    vert: `
      precision mediump float;
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;
      uniform mat4 projection, view, model;
      void main() {
        vUv = uv;
        gl_Position = projection * view * model * vec4(position, 1);
      }
    `,
    // language=GLSL
    frag: `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D texture;
      void main () {
        gl_FragColor = texture2D(texture, vUv);
      }
    `,
  });
}

</script>

<template>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" />
  <Slider label="distance" v-model="$settings.distance" :min="0" :max="5" :step=".05" />
</template>

<style scoped>
canvas {
  touch-action: none;
}
</style>
