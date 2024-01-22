<script setup>
import {computed, reactive, ref, unref, watch, watchEffect} from 'vue';
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
import {syncScramblers, useScrambledText} from "../vue/use-scrambled-text.js";
import {useReglTexture} from "../vue/use-regl-texture.js";

import {useReglFramebuffer} from "../vue/use-regl-framebuffer.js";
import {colorToRgba} from "../colors.js";
import {watchLog} from "../vue/development.js";

const props = defineProps({
  title: {type: String, default: ''},
  subtitle: {type: String, default: ''},
  avatar: {type: [Blob, HTMLImageElement]},
  background: {type: [String, Blob, HTMLImageElement]},
  foil: {type: [String, Blob, HTMLImageElement]},
  glow: {type: String, default: 'deepskyblue'},
  textColor: {type: String, default: 'white'},
  textShadow: {type: String},
  textStrokeWidth: {type: Number, default: 0},
  textStrokeColor: {type: String, default: 'white'},
});

const $glowColor = computed(() => {
  if (!props.glow) return undefined;
  return Array.from(colorToRgba(props.glow).slice(0, 3)).map(c => c / 0xFF);
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

const $background = useReglTexture($regl, () => props.background);
const $foil = useReglTexture($regl, () => props.foil, {flipY: true});
const $cardBuffer = useReglFramebuffer($regl, cardSize.multiply(pxRatio).toSize());
const overlayCanvas = makeOffscreenCanvas(cardSize.x, cardSize.y);
const overlay = /** @type {CanvasRenderingContext2D} */ overlayCanvas.getContext('2d');
overlay.textRendering = 'optimizeSpeed';
const $overlayBuffer = useReglTexture($regl, overlayCanvas);
const $title = useScrambledText(() => props.title);
const $subtitle = useScrambledText(() => props.subtitle);
syncScramblers($title.state, $subtitle.state);
const $avatar = useReglTexture($regl, () => props.avatar);

let baseDirty = false;
watch($glowColor, () => {
  baseDirty = true;
});

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
  const drawTexture = makeTextureRenderer(regl);
  const drawAvatar = makeAvatarRenderer(regl);

  let last = performance.now();

  function drawRain() {
    const now = performance.now();
    rainRender(now - last);
    overlayBuffer(overlayCanvas);
    last = now;
  }

  function drawName() {
    const title = unref($title.text);
    const subtitle = unref($subtitle.text);
    const {width, height} = overlay.canvas;
    overlay.reset();
    overlay.clearRect(0, 0, width, height);

    overlay.fillStyle = props.textColor;
    overlay.textAlign = 'center';
    overlay.shadowBlur = 20;
    overlay.shadowColor = props.textShadow ?? props.glow;

    const shadowRepeats = 5;
    const xCenter = width / 2;

    // Perf: Calling fillText with empty string is much slower than with actual text
    if (title) {
      overlay.font = `${60 * pxRatio}px monospace`;
      const y = height * 0.8;
      for (let i = 0; i < shadowRepeats; i++) {
        overlay.fillText(title, xCenter, y);
      }
      if (props.textStrokeWidth && props.textStrokeColor !== '#00000000') {
        const oldBlur = overlay.shadowBlur;
        overlay.shadowBlur = 0;
        overlay.lineWidth = props.textStrokeWidth * pxRatio;
        overlay.strokeStyle = props.textStrokeColor;
        overlay.strokeText(title, xCenter, y);

        overlay.fillText(title, xCenter, y);
        overlay.shadowBlur = oldBlur;
      }
    }
    if (subtitle) {
      overlay.font = `${30 * pxRatio}px monospace`;
      const y = height * 0.86;
      for (let i = 0; i < shadowRepeats; i++) {
        overlay.fillText(subtitle, xCenter, y);
      }
    }
    overlayBuffer(overlayCanvas);
  }

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

  let prevBgCounter = background.counter;
  return function Render({mouse} = {}) {
    const backgroundChanged = background.counter != prevBgCounter;
    prevBgCounter = background.counter;
    // 1. Draw the card content
    cardBuffer.use(() => {
      regl.clear({depth: 1});
      drawCard({
        baseChanged: backgroundChanged || baseDirty,
        image: background,
        glowColor: $glowColor.value,
        foil,
        mouse,
        layers: () => {
          noDepth(() => {
            mixPlusLighter(() => {
              drawRain();
              drawTexture({texture: overlayBuffer});
            });
            if ($avatar.value) {
              const pos = new Vec2(regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight).multiply([0.5, 0.5]);
              drawAvatar(
                  $avatar.value,
                  avatarSize / 2,
                  pos
              );
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
    baseDirty = false;
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

</script>
<template>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" style="height:auto" />
</template>
