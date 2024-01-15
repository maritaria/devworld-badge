<script setup>
import {computed, ref, unref, watchEffect} from 'vue';
import {useRegl} from "../vue/use-regl.js";
import {computedAsync, noop} from "@vueuse/core";
import {loadCardResources, makeCardRenderer} from "../regl/card-renderer.js";
import {useMousePosition} from "../vue/use-mouse-position.js";
import {makeTiltedPanelRenderer} from "../regl/panel-renderer.js";
import {Vec2} from "../Vec2.js";
import {useSpring} from "../vue/use-spring.js";
import {makeOffscreenCanvas, pxRatio} from "../canvas.js";
import {makeMatrixRainRenderer} from "../regl/matrix-rain-renderer.js";
import {makeTextureRenderer} from "../regl/texture-renderer.js";
import {frameLoop, loadImageFromBlob} from "../regl/utilities.js";
import AvatarPicker from "./AvatarPicker.vue";
import {makeAvatarRenderer} from "../regl/avatar-renderer.js";
import {makeSpriteRenderer} from "../regl/sprite-renderer.js";
import {useScrambledText} from "../vue/use-scrambled-text.js";

const $canvas = ref(null);
const cardSize = new Vec2(400, 564).multiply(2).round();
const avatarSize = 400 * pxRatio;
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
  const drawSprite = makeSpriteRenderer(regl);

  const cardBufferSize = cardSize.multiply(pxRatio);

  const cardBuffer = regl.framebuffer({
    ...cardBufferSize.toSize(),
  });

  const overlayCanvas = makeOffscreenCanvas(cardSize.x, cardSize.y);
  const overlay = overlayCanvas.getContext('2d');
  const rainRender = makeMatrixRainRenderer(overlayCanvas, 15 * pxRatio);
  const overlayBuffer = regl.texture(overlayCanvas);

  let last = performance.now();

  function drawRain() {
    const now = performance.now();
    rainRender(now - last);
    overlayBuffer(overlayCanvas);
    last = now;
  }

  function drawName() {
    overlay.reset();
    overlay.clearRect(0, 0, overlay.canvas.width, overlay.canvas.height);
    overlay.font = '40px monospace';
    overlay.fillStyle = 'white';
    overlay.textAlign = 'center';
    overlay.shadowBlur = 20;
    overlay.shadowColor = 'deepskyblue';

    const scale = 3;
    overlay.scale(scale, scale);
    const shadowRepeats = 5;
    const screen = Vec2.fromSize(overlay.canvas).divide(scale);
    const center = screen.multiply(0.5, 0.7);

    for (let i = 0; i < shadowRepeats; i++) {
      overlay.fillText($scramble.value, center.x, center.y);
    }

    overlayBuffer(overlayCanvas);
  }

  const drawTexture = makeTextureRenderer(regl);
  const noDepth = regl({depth: {enable: false}});
  const mixPlusLighter = regl({
    blend: {
      enable: true,
      func: {src: 'src alpha', dst: 'dst alpha'},
    },
  });
  const mixAdditiveBlend = regl({
    blend: {
      enable: true,
      func: {src: 'src alpha', dst: 'one minus src alpha'},
    },
  });
  const drawAvatar = makeAvatarRenderer(regl);

  return function Render({mouse} = {}) {
    // 1. Draw the card content
    cardBuffer.use(() => {
      regl.clear({depth: 1});
      drawCard({
        ...resources,
        mouse,
        layers: () => {
          noDepth(() => {
            mixPlusLighter(() => {
              drawRain();
              drawTexture({texture: overlayBuffer});
            });
            if ($avatar.value) {
              const bufferSize = new Vec2(regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight);
              const avatarPos = bufferSize.multiply([0.5, 0.4]);
              drawAvatar($avatar.value, avatarSize / 2, avatarPos);
            }
            mixAdditiveBlend(() => {
              drawName();
              drawTexture({texture: overlayBuffer});
            });
          });
        },
      });
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
    const cancel = frameLoop(regl, () => {
      render({
        // Convert [0..1] screen coords to [-1..1] gl space
        mouse: [
          mouse.x * 2 - 1,
          -(mouse.y * 2 - 1),
        ],
      });
    });

    onCleanup(cancel);
  }
});

const $name = ref('Bram Kamies');
const $scramble = useScrambledText($name);

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
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" style="height:auto;max-width:80vw" />
</template>
