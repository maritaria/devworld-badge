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
  const [width, height] =  remapByWidth([badge.width, badge.height], 400)
  drawImage({
    texture: badge,
    size: [width, height],
    corner: Math.min(width, height) * 0.06,
  });
});

function remapByWidth([width, height], newWidth) {
  const multiplier = newWidth / width;
  return [
      newWidth,
      height * multiplier,
  ];
}

/**
 * @param {REGL.Regl} regl
 * @param src
 * @return {Promise<REGL.Texture2D>}
 */
function loadTexture(regl, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(regl.texture({
        data: img,
        min: 'linear',
        mag: 'linear',
      }));
    };
    img.onerror = (event, source, lineno, colno, cause) => {
      const error = new Error("Image failed to load");
      error.cause = cause;
      reject(error);
    };
  });
}

/**
 * @param {REGL.Regl} regl
 * @return {REGL.DrawCommand}
 */
function makeDrawImage(regl) {
  return regl({
    vert: `
    precision highp float;
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
    uniform float corner;
    uniform vec2 size;
    varying vec2 uv;

    float cornerDistance(in vec2 localPos, in float corner) {
      if (localPos.x > corner) {
        return 1.0;
      } else if (localPos.y > corner) {
        return 1.0;
      } else {
        float d = distance(vec2(corner), localPos);
        return (corner - d);
      }
    }

    float cornerAlpha(vec2 uv, vec2 size) {
      vec2 localPos = uv * size;
      // uv:
      // [0,0] = top-left
      // [1,1] = bottom-right
      vec2 topLeft = localPos;
      vec2 bottomRight = size - localPos;
      vec2 topRight = vec2(bottomRight.x, topLeft.y);
      vec2 bottomLeft = vec2(topLeft.x, bottomRight.y);
      return (
        cornerDistance(topLeft, corner)
        * cornerDistance(bottomRight, corner)
        * cornerDistance(topRight, corner)
        * cornerDistance(bottomLeft, corner)
      );
    }

    void main() {
      gl_FragColor = texture2D(texture, uv);
      // Create rounded corners using alpha channel
      gl_FragColor.a *= cornerAlpha(uv, size);
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
      corner: regl.prop('corner'),
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
