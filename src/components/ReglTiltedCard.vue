<script setup>
import {computed, onMounted, reactive, ref, watchEffect} from "vue";
import createREGL from "regl";
import {loadTexture} from "../regl-utilities.js";
import badgeUrl from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import {chunk} from "../array.chunk.js";
import {toRadians} from "../math.js";
import {vec4, mat4} from "gl-matrix";

const $canvas = ref(null);
const render = ref(() => {
});
const size = reactive({width: 400, height: 564});
const mouse = reactive({x: 0.5, y: 0.5});
const worldPos = reactive({x: 0, y: 0, z: -1});

const fov = ref(90);

const perspective = computed(() => {
  const matrix = mat4.create();
  const aspect = size.width / size.height;
  mat4.perspectiveNO(matrix, toRadians(fov.value), aspect, 0.001, 20);
  return matrix;
});

const world = computed(() => {
  const matrix = mat4.create();

  const rx = (mouse.x * 100 - 50) / 1.5;
  const ry = (mouse.y * 100 - 50) / 2;

  mat4.translate(matrix, matrix, [worldPos.x, worldPos.y, worldPos.z]);

  mat4.rotateY(matrix, matrix, toRadians(rx));
  mat4.rotateX(matrix, matrix, toRadians(ry));
  mat4.translate(matrix,matrix,[0,0,0]);



  return matrix;
});

const combined = computed(() => {
  const matrix = mat4.create();
  if (true) {
    mat4.multiply(matrix, world.value, matrix);
    mat4.multiply(matrix, perspective.value, matrix);
  } else {
    const lookAt = mat4.create();
    mat4.lookAt(lookAt, [0, 0, -1], [ 0, 0, 0], [0, 1, 0]);
    const camera = perspective.value;
    mat4.multiply(matrix, lookAt, matrix);
    mat4.multiply(matrix, perspective, matrix);
  }

  console.log('world', '\n' + fmtMatrix(world.value));
  console.log('perspective', '\n' + fmtMatrix(perspective.value));
  console.log('combined', '\n' + fmtMatrix(matrix));

  return matrix;
});

function fmtMatrix(matrix) {
  const cells = Array.from(matrix).map(n => n.toFixed(3).padStart(6, '+').slice(0, 6));
  return chunk(cells, 4).map(row => row.join(' ')).join('\n');
}

const tests = ref();

watchEffect(() => {
  const tests = [
    // Triangle 1
    [0 - 1, 0 - 1],
    [1, 0 - 1],
    [1, 1],
    // Triangle 2
    [0 - 1, 0 - 1],
    [1, 1],
    [0 - 1, 1],
  ];
  tests.forEach(test => {
    const input = [...test, 0, 1];
    const output = vec4.transformMat4(vec4.create(), input, combined.value)
    const norm = [output[0] / output[3], output[1] / output[3], output[2] / output[3]];
    console.log('test', input, output, norm);
  });
});

onMounted(async () => {
  if (!$canvas.value) throw Error("Missing ref($canvas)");
  /** @type HTMLCanvasElement */
  const canvas = $canvas.value;
  const pxRatio = window.devicePixelRatio;

  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;
  canvas.width = size.width * pxRatio;
  canvas.height = size.height * pxRatio;

  const regl = createREGL(canvas);

  const attachMouse = regl({
    context: {mouse: (_, props) => props?.mouse ?? [0, 0]}
  })

  const image = await loadTexture(regl, badgeUrl, {flipY: true});

  const drawPanel = makeTiltedRenderer(regl);


  render.value = function render() {
    const transform = combined.value;
    attachMouse({mouse}, () => {
      drawPanel({texture: image, transform});
    });
  };

  render.value();

});

/**
 * @param {REGL.Regl} regl
 * @returns {REGL.DrawCommand}
 */
function makeTiltedRenderer(regl) {
  return regl({
    count: 6,
    attributes: {
      position: [
        // Triangle 1
        [0 - 1, 0 - 1],
        [1, 0 - 1],
        [1, 1],
        // Triangle 2
        [0 - 1, 0 - 1],
        [1, 1],
        [0 - 1, 1],
      ],
    },
    uniforms: {
      texture: regl.prop('texture'),
      transform: regl.prop('transform'),
    },
    vert: `
      precision highp float;
      attribute vec2 position;
      uniform mat4 transform;
      varying vec2 uv;

      void main() {
        gl_Position = vec4(position, 0, 1);
        gl_Position *= transform;
        uv = position;
      }
    `,
    frag: `
      precision highp float;
      varying vec2 uv;

      void main() {
        gl_FragColor = vec4(uv, 0.0, 1.0);
      }
    `,
  });
}


function onMouseMove(event) {
  const rect = event.target.getBoundingClientRect();
  mouse.x = (event.clientX - rect.left) / rect.width;
  mouse.y = (event.clientY - rect.top) / rect.height;
}

function onMouseLeave(event) {
  mouse.x = 0.5;
  mouse.y = 0.5;
}

watchEffect(() => {
  applyTilt(window.app, {x: mouse.x * 100, y: mouse.y * 100});

  render?.value();
});

</script>

<template>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" />
  <label>
    <span>fov: {{ fov }}</span>
    <input type="range" min="45" max="120" v-model="fov" />
  </label>
  <label>
    <span>w.x:{{ worldPos.x }}</span>
    <input type="range" min="-10" max="10" step="0.1" v-model="worldPos.x" />
  </label>
  <label>
    <span>w.y:{{ worldPos.y }}</span>
    <input type="range" min="-10" max="10" step="0.1" v-model="worldPos.y" />
  </label>
  <label>
    <span>w.z:{{ worldPos.z }}</span>
    <input type="range" min="-10" max="10" step="0.1" v-model="worldPos.z" />
  </label>
</template>

<style scoped>

label {
  display: flex;
  align-items: center;
  & span {
    display: inline-block;
    width: 80px;
    font-family: monospace;
  }
  & input {
    flex-grow: 1;
  }
}
</style>
