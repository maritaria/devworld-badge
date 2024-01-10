<script setup>
import {ref, onMounted, watchEffect, reactive} from "vue";
import createREGL from "regl";
import {loadTexture} from "../regl/utilities.js";
import textureUrl from "../assets/doc/linkedin-black-friday-sale.png";
import {pxRatio} from "../canvas.js";

const $canvas = ref(null);
const $render = ref(null);
const size = reactive({width: 400, height: 500});


onMounted(async () => {
  if (!$canvas.value) throw Error("Missing ref($canvas)");
  /** @type HTMLCanvasElement */
  const canvas = $canvas.value;

  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;
  canvas.width = size.width * pxRatio;
  canvas.height = size.height * pxRatio;

  const regl = createREGL(canvas);

  const texture = await loadTexture(regl, textureUrl);

  const drawCube = makeCubeRenderer(regl);

  regl.frame(() => {
    regl.clear({color: [0, 0, 0, 255], depth: 1});
    drawCube({texture});
  });
});

import {mat4} from "gl-matrix";

import {position, uv, elements} from '../cube.data.js';


/** @param {REGL.Regl} regl */
function makeCubeRenderer(regl) {
  return regl({
    elements,
    attributes: {
      position,
      uv,
    },
    uniforms: {
      view: ({tick}) => {
        const t = 0.01 * tick
        return mat4.lookAt([],
            [5 * Math.cos(t), 2.5 * Math.sin(t), 5 * Math.sin(t)],
            [0, 0.0, 0],
            [0, 1, 0])
      },
      projection: ({viewportWidth, viewportHeight}) =>
          mat4.perspective([],
              Math.PI / 4,
              viewportWidth / viewportHeight,
              0.01,
              10),
      tex: regl.prop('texture'),
    },
    // language=GLSL
    vert: `
      precision mediump float;
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;
      uniform mat4 projection, view;
      void main() {
        vUv = uv;
        gl_Position = projection * view * vec4(position, 1);
      }
    `,
    // language=GLSL
    frag: `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D tex;
      void main () {
        gl_FragColor = texture2D(tex, vUv);
      }
    `,
  });
}

</script>

<template>
  <canvas ref="$canvas"></canvas>
</template>

<style scoped>

</style>
