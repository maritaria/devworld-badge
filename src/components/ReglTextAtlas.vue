<script setup>
import {useRegl} from "../vue/use-regl.js";
import {ref, unref} from "vue";
import {computedAsync} from "@vueuse/core";
import {createHtmlTexture} from "../resources.js";
import {makeTextureRenderer} from "../regl/texture-renderer.js";
import {position, uv} from "../cube.data.js";
import {Vec2} from "../Vec2.js";

const $canvas = ref(null);
/** @type {import('vue').Ref<REGL.Regl>} */
const $regl = useRegl($canvas, {width: 300, height: 300});

const $render = computedAsync(async () => {
  const regl = unref($regl);
  if (!regl) return;
  const alphabets = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    '!@#$%^&*_+-=;:|<>,.?§~',
  ];
  const {texture} = await makeNeonTextAtlas(regl, alphabets.join(''));
  const drawQuad = makeQuadRenderer(regl);
  drawQuad({
    texture,
    srcSize: [60, 60],
    srcPos: [0, 0],
    destSize: [60, 60],
    destPos: [0, 0],
  });
  drawQuad({
    texture,
    srcSize: [60, 60],
    srcPos: [0, 0],
    destSize: [60, 60],
    destPos: [0, 0],
  });
});

/**
 * @param {REGL.Regl} regl
 * @param {string} chars
 * @return {Promise<{metadata: unknown, texture: REGL.Texture2D}>}
 */
async function makeNeonTextAtlas(regl, chars) {
  const charWidth = 60;
  const charHeight = 60;
  const list = chars.split('');
  // 1. Create the atlas metadata
  const charmap = {};
  list.forEach((char, index) => {
    charmap[char] = {
      pos: [0, charHeight * index],
      size: [charWidth, charHeight],
    };
  });

  // 2. Generate the atlas html
  // language=html
  const html = `
    <style>
      #atlas {
        font-size: 40px;
        font-family: monospace;
        color: white;
        text-shadow: cyan 0 0 5px, skyblue 0 0 10px, deepskyblue 0 0 5px;
        text-rendering: optimizeLegibility;
        width: ${charWidth}px;
      }

      #atlas > div {
        width: ${charWidth}px;
        height: ${charHeight}px;
        text-align: center;
      }
    </style>
    <div id="atlas">
      ${list.map(char => `<div>${encodeURIComponent(char)}</div>`).join('')}
    </div>
  `;
  // 3. Render atlas to canvas
  const texture = await createHtmlTexture(regl, charWidth, charHeight * list.length, html);
  // 4. Export canvas to texture
  return {charmap, texture};
}

/** @param {REGL.Regl} regl */
function makeQuadRenderer(regl) {
  return regl({
    elements: [[2, 1, 0], [2, 0, 3]],
    attributes: {
      position: [[0, 1], [1, 1], [1, 0], [0, 0]],
      uv: [[0, 0], [1, 0], [1, 1], [0, 1]],
    },
    uniforms: {
      screen: (context, props) => {
        console.log('context', context);
        console.log('props', props);
        return [context.drawingBufferWidth, context.drawingBufferHeight];
      },
      textureSize: (_, props) => [props.texture.width, props.texture.height],
      destSize: regl.prop('destSize'),
      destPos: regl.prop('destPos'),
      srcSize: regl.prop('srcSize'),
      srcPos: regl.prop('srcPos'),
      texture: regl.prop('texture'),
      z: (_, props) => props.z ?? 0,
    },
    // language=GLSL
    vert: `
      precision mediump float;
      uniform vec2 destSize;
      uniform vec2 destPos;
      uniform vec2 srcSize;
      uniform vec2 srcPos;
      uniform float z;
      uniform vec2 screen;
      uniform vec2 textureSize;
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        // Remap screen coordinates to [0..1]
        vec2 pos = (destPos + position * destSize) / screen;
        // Remap [0..1] to [-1..1]
        pos = pos * 2.0 - 1.0;
        // Flip y
        pos.y = -pos.y;
        gl_Position = vec4(pos, z, 1);

        vec2 UV = (srcPos + position * srcSize) / textureSize;
        vUv = UV;
      }
    `,
    // language=GLSL
    frag: `
      precision mediump float;
      uniform sampler2D texture;
      varying vec2 vUv;
      void main() {
        gl_FragColor = texture2D(texture, vUv);
      }
    `,
    depth: {
      enable: false,
    },
    blend: {
      enable: true,
      func: {
        src: 'src color',
        dst: 'one minus src alpha',
      },
    },
  });
}

</script>

<template>
  <canvas ref="$canvas" />
</template>

<style scoped>

</style>
