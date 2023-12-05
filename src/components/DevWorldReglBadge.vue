<script setup>
import {computed, onMounted, ref, watch, watchEffect} from "vue";
import createREGL from 'regl';
import badgeImg from '../assets/doc/niki-devworld-badge-sample-3.jpg';
import {useRafFn} from "@vueuse/core";

const $canvas = ref(null);

onMounted(async () => {
  if (!$canvas.value) throw Error("Missing ref($canvas)");
  const regl = createREGL($canvas.value);
  const badge = await loadTexture(regl, badgeImg);
  const drawImage = makeDrawImage(regl);
  drawImage({
    texture: badge,
    size: [badge.width/4, badge.height/4],
  });
});

function remapByWidth([width, height], newWidth) {
  const multiplier = newWidth / width;
  return [
      newWidth,
      height * multiplier,
  ];
}

function loadTexture(regl, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(regl.texture(img));
    };
    img.onerror = (event, source, lineno, colno, cause) => {
      const error = new Error("Image failed to load");
      error.cause = cause;
      reject(error);
    };
  });
}

function makeDrawImage(regl) {
  return regl({
    vert: `
    precision mediump float;
    uniform vec2 screen;
    uniform vec2 size;
    attribute vec2 point;

    varying vec2 uv;

    void main () {
      vec2 localSize = size / screen;
      vec2 localPos = point;

      gl_Position = vec4(localPos * localSize, 0, 1);
      uv = point.xy * vec2(.5, -.5) + vec2(0.5, 0.5);
    }`,
    frag: `
    precision highp float;

    uniform sampler2D texture;
    varying vec2 uv;

    void main() {
      gl_FragColor = texture2D(texture, uv);
    }`,
    attributes: {
      point: regl.buffer([
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, -1],
        [1, 1],
        [-1, 1],
      ]),
    },
    uniforms: {
      screen: function (context, props) {
        return [
          context.viewportWidth,
          context.viewportHeight,
        ];
      },
      // Input
      texture: regl.prop('texture'),
      size: regl.prop('size'),
    },
    count: 6,
  });
}

</script>

<template>
  <canvas ref="$canvas" width="450" height="600" />
</template>

<style scoped>

</style>
