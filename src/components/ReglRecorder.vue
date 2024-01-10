<script setup>
import {ref, onMounted, watchEffect, reactive} from "vue";
import createREGL from "regl";
import {loadTexture} from "../regl/utilities.js";
import textureUrl from "../assets/doc/linkedin-black-friday-sale.png";

const $canvas = ref(null);
const $render = ref(null);
const size = reactive({width: 400, height: 500});

const $now = ref(0);
const $start = ref(0);

onMounted(async () => {
  if (!$canvas.value) throw Error("Missing ref($canvas)");
  /** @type HTMLCanvasElement */
  const canvas = $canvas.value;
  const pxRatio = 1;

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
import {download} from "../blobs.js";


/** @param {REGL.Regl} regl */
function makeCubeRenderer(regl) {
  return regl({
    elements,
    attributes: {
      position,
      uv,
    },
    uniforms: {
      view: ({time}) => {
        $now.value = time;
        const t = (time - $start.value) * Math.PI / 8;// $time.value;
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

const isRecording = ref(false);
const recordedChunks = [];
const $recorder = ref(null);

onMounted(() => {
  const canvas = $canvas.value;
  if (!canvas) throw new Error('No canvas');
  const stream = canvas.captureStream();
  const recorder = new MediaRecorder(stream, {
    // FireFox does not support "video/webm; codecs=vp9"
    mimeType: 'video/webm',
  });
  recorder.onerror = (event) => console.log('recorder: error', event.error);
  recorder.onresume = () => console.log('recorder: resume');
  recorder.onpause = () => console.log('recorder: pause');
  recorder.onstart = () => {
    console.log('recorder: start');
    recordedChunks.splice(0, recordedChunks.length);
  };
  recorder.ondataavailable = function(event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
      console.log('recorder: data-available', event.data.type, recordedChunks.length, 'chunks');
    }
  };
  recorder.onstop = () => {
    console.log('recorder: stop', recordedChunks.length, 'chunks');
    const blob = recordedChunks.length > 1 ? new Blob(recordedChunks, {type: recordedChunks[0].type}) : recordedChunks[0];
    // TODO: https://github.com/yusitnikov/fix-webm-duration
    console.log('Total download size:', blob.size);
    download(blob, `test-5s.webm`);
  };
  $recorder.value = recorder;
});

function startRecording() {
  if (!$recorder.value) throw new Error('No recorder');
  recordedChunks.splice(0, recordedChunks.length);
  $start.value = $now.value;
  requestAnimationFrame(() => {
    $recorder.value.start(1000);
    setTimeout(stopRecording, 5_000);
  });
}

function stopRecording() {
  $recorder.value?.stop();
}

</script>

<template>
  <canvas ref="$canvas"></canvas>
  <button type="button" @click="startRecording">Start recording</button>
  <button type="button" @click="stopRecording">Stop recording</button>
  <span>Recorder: {{$recorder?.state}}</span>
</template>

<style scoped>

</style>
