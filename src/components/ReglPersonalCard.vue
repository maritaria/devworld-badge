<script setup>
import {computed, ref, unref, watch, watchEffect} from 'vue';
import {useRegl} from "../vue/use-regl.js";
import {computedAsync, noop} from "@vueuse/core";
import {loadCardResources, makeCardRenderer} from "../regl/card-renderer.js";
import {useMousePosition} from "../vue/use-mouse-position.js";
import {makeTiltedPanelRenderer} from "../regl/panel-renderer.js";
import {Vec2} from "../Vec2.js";
import {useSpring} from "../vue/use-spring.js";
import {makeOffscreenCanvas, pxRatio} from "../canvas.js";
import {makeMatrixRainRenderer} from "../regl/matrix-rain-renderer.js";
import {makePlusLighterMixer} from "../regl/plus-lighter-mixer.js";
import {makeTextureRenderer} from "../regl/texture-renderer.js";
import {loadImageFromBlob, loadTextureFromBlob} from "../regl/utilities.js";
import AvatarPicker from "./AvatarPicker.vue";
import {createImage} from "../resources.js";
import {makeAvatarRenderer} from "../regl/avatar-renderer.js";
import {useReglTextSurface} from "../vue/use-regl-text-surface.js";

const $canvas = ref(null);
const cardSize = new Vec2(400, 564).multiply(2).round();
const avatarSize = 400;
const distancePassive = 1.5;
const distanceHover = 1.2;
const $regl = useRegl($canvas, {
  ...cardSize.toSize(),
  attributes: {
    // Needed for the corner renderer, as it only affects the alpha channel.
    premultipliedAlpha: false,
    antialias: true,
  },
});

const {mouse, onMouseMove, onMouseLeave} = useMousePosition();
const props = useMouseTilt(mouse);

function useMouseTilt(mouse) {
  const tilt = computed(() => {
    // Tilt is expressed in degrees
    const m = Vec2.fromObject(mouse).subtract(0.5).multiply(-100);
    return {
      x: m.x / 1.5,
      y: m.y / 2,
    };
  });
  const springX = useSpring(() => tilt.value.x);
  const springY = useSpring(() => tilt.value.y);
  const distance = useSpring(() => mouse.hover ? distanceHover : distancePassive, {
    stiffness: 1 / 20,
    damping: 1 / 8,
  });
  return computed(() => {
    return {
      tilt: {
        x: springY.value,
        y: springX.value,
      },
      distance: distance.value,
    };
  });
}


const $render = computedAsync(async () => {
  const regl = /** @type {REGL.Regl} */ unref($regl);
  if (!regl) return;
  const resources = await loadCardResources(regl);
  const drawCard = makeCardRenderer(regl, {
    ...cardSize.toSize(),
    cornerRadius: 60,
    blurRadius: 40,
    blurSpread: 20,
  });
  const drawPanel = makeTiltedPanelRenderer(regl);

  const cardBuffer = regl.framebuffer({
    ...cardSize.multiply(pxRatio).toSize(),
  });

  const rainCanvas = makeOffscreenCanvas(cardSize.x, cardSize.y);
  const rainRender = makeMatrixRainRenderer(rainCanvas, 15 * pxRatio);
  rainCanvas.getContext('2d').globalAlpha = 0.6;
  const rainBuffer = regl.texture(rainCanvas);
  let last = performance.now();

  function rainDraw() {
    const now = performance.now();
    rainRender(now - last);
    rainBuffer(rainCanvas);
    last = now;
  }

  const drawTexture = makeTextureRenderer(regl);
  const mixPlusLighter = regl({
    depth: {enable: false},
    blend: {
      enable: true,
      func: {src: 'src alpha', dst: 'dst alpha'},
    },
  });
  const drawAvatar = makeAvatarRenderer(regl);

  return function Render({mouse} = {}) {
    // 1. Update and prepare the matrix rain layer
    rainDraw();
    // 2. Render the card to a framebuffer
    cardBuffer.use(() => {
      regl.clear({depth: 1});
      drawCard({
        ...resources,
        mouse,
        layers: () => {
          mixPlusLighter(() => {
            drawTexture({texture: rainBuffer});
          });
          if ($avatar.value) {
            const bufferSize = new Vec2(regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight);
            const avatarPos = bufferSize.multiply([0.5, 0.4]);
            drawAvatar($avatar.value, avatarSize / 2, avatarPos);
          }
        },
      });
    });
    // 3. Render the panel with the card on it.
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

const $name = ref('Bram Kamies');
const $nameSurface = useReglTextSurface($regl, $name, {
  font: '40px monospace',
  shadowBlur: 5,
  shadowColor: 'deepskyblue',
  shadowRepeats: 5,
});
/** @type {import('vue').Ref<HTMLImageElement|Blob|null>} */
const $avatarSource = ref(null);
/** @type {import('vue').Ref<REGL.Texture2D | null>} */
const $avatar = computedAsync(async () => {
  const regl = unref($regl);
  return regl.texture(avatarSize.x, avatarSize.y);
});

watchEffect(async () => {
  const avatar = unref($avatar);
  let source = unref($avatarSource);
  if (!avatar || !source) return;

  if (source instanceof Blob) {
    // Convert Blob to HTMLImageElement
    let loadedSource = await loadImageFromBlob(source);
    if ($avatarSource.value !== source) {
      // Bail: source changed during await.
      return;
    }
    source = loadedSource;
  }
  console.assert(source instanceof HTMLImageElement, '$avatarSource type not supported', source);
  avatar(source);
});

watchEffect(() => void console.log('$name', $name.value));
watchEffect(() => void console.log('$avatar', $avatar.value));



</script>
<template>
  <form @submit.prevent>
    <label>
      Name:
      <input type="text" v-model="$name" placeholder="Bram Kamies">
    </label>
    <span>Picture:</span>
    <AvatarPicker v-model="$avatarSource" />
  </form>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" style="height:auto;max-width:80vw"/>
  <h1>To-do list</h1>
  <ol>
    <li><input type="checkbox" readonly>Display name</li>
    <li><input type="checkbox" readonly>Fix touch gestures on mobile</li>
    <li><input type="checkbox" readonly>Fix avatar pixelation (specifically of the preset images)</li>
    <li><input type="checkbox" readonly checked>Fix upload button not visible on mobile</li>
  </ol>
</template>
