<script setup>
import {computed, ref, unref, watchEffect} from 'vue';
import {useRegl} from "../vue/use-regl.js";
import {noop} from "@vueuse/core";
import {makeCardRenderer} from "../regl/card-renderer.js";
import {useMousePosition} from "../vue/use-mouse-position.js";
import {makeTiltedPanelRenderer} from "../regl/panel-renderer.js";
import {Vec2} from "../Vec2.js";
import {useSpring} from "../vue/use-spring.js";
import {makeOffscreenCanvas, pxRatio} from "../canvas.js";
import {makeMatrixRainRenderer} from "../regl/matrix-rain-renderer.js";
import {makeTextureRenderer} from "../regl/texture-renderer.js";
import {frameLoop} from "../regl/utilities.js";
import {makeAvatarRenderer} from "../regl/avatar-renderer.js";
import {makeSpriteRenderer} from "../regl/sprite-renderer.js";
import {useScrambledText} from "../vue/use-scrambled-text.js";
import {useReglTexture} from "../vue/use-regl-texture.js";

import backgroundUrl from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import foilUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";
import {useReglFramebuffer} from "../vue/use-regl-framebuffer.js";

const props = defineProps({
  title: {type: String},
  avatar: {type: [Blob, HTMLImageElement]},
});

const $canvas = ref(null);
const cardSize = new Vec2(600, 846);
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

// todo:
//     1. switch the background to black
//     2. switch neon color to green (the 3rd option in the cards list)
//     3. Add generic shine glow to background (try by disabling foil or using white surface)
//     4.

const {mouse, onMouseMove, onMouseLeave} = useMousePosition();
const $tilt = useMouseTilt(mouse);

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

const $background = useReglTexture($regl, backgroundUrl);
const $foil = useReglTexture($regl, foilUrl, {flipY: true});
const $cardBuffer = useReglFramebuffer($regl, cardSize.multiply(pxRatio).toSize());
const overlayCanvas = makeOffscreenCanvas(cardSize.x, cardSize.y);
const overlay = overlayCanvas.getContext('2d');
const $overlayBuffer = useReglTexture($regl, overlayCanvas)

const $render = computed(() => {
  const regl = /** @type {REGL.Regl} */ unref($regl);
  const background = unref($background);
  const foil = unref($foil);
  const cardBuffer = unref($cardBuffer);
  const overlayBuffer = unref($overlayBuffer);
  if (!regl || !background || !foil || !cardBuffer || !overlayBuffer) return;

  const drawCard = makeCardRenderer(regl, {
    ...cardSize.toSize(),
    cornerRadius: 60 * pxRatio,
    blurRadius: 40 * pxRatio,
    blurSpread: 20 * pxRatio,
  });
  const drawPanel = makeTiltedPanelRenderer(regl);
  const drawSprite = makeSpriteRenderer(regl);
  const rainRender = makeMatrixRainRenderer(overlayCanvas, 15 * pxRatio);

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
    overlay.font = `${20 * pxRatio}px monospace`;
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
        image: background,
        foil,
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
      tilt: $tilt.value.tilt,
      distance: $tilt.value.distance,
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

const $scramble = useScrambledText(() => props.title);

/** @type {import('vue').Ref<HTMLImageElement|Blob|null>} */
const $avatarSource = computed(() => props.avatar);
/** @type {import('vue').Ref<REGL.Texture2D | null>} */
const $avatar = useReglTexture($regl, $avatarSource);

</script>
<template>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" style="height:auto;max-width:80vw" />
</template>
