<script setup>
import {computed, reactive, ref, toValue, unref, watch, watchEffect} from 'vue';
import {useRegl} from "../vue/use-regl.js";
import {noop, useNow} from "@vueuse/core";
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

const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAIBAAA=';
const props = defineProps({
  canvasSize: {type: Array, default: () => [600, 846]},
  cardSize: {type: Array, default: () => [600, 846]},
  distancePassive: {type: Number, default: 1.5},
  distanceHover: {type: Number, default: 1.2},
  // Card
  background: {type: [String, Blob, HTMLImageElement]},
  foil: {type: [String, Blob, HTMLImageElement], default: transparentPixel},
  glow: {type: String, default: 'deepskyblue'},
  // Text
  title: {type: String, default: ''},
  subtitle: {type: String, default: ''},
  textColor: {type: String, default: 'white'},
  textShadowColor: {type: String},
  textStrokeWidth: {type: Number, default: 0},
  textStrokeColor: {type: String, default: 'white'},
  textAlign: {type: String, default: 'center'},
  titleAnchor: {type: Array, default: () => [0.5, 0.8]},
  subtitleAnchor: {type: Array, default: () => [0.5, 0.86]},
  // Avatar
  avatar: {type: [Blob, HTMLImageElement]},
  avatarSize: {type: Number, default: 400},
  avatarAnchor: {type: Array, default: () => [0.5, 0.45]},
});
const $cardSize = computed(() => new Vec2(...props.cardSize));

const $glowColor = computed(() => {
  if (!props.glow) return undefined;
  return Array.from(colorToRgba(props.glow).slice(0, 3)).map(c => c / 0xFF);
});

/** @type {import('vue').Ref<HTMLCanvasElement|null>} */
const $canvas = ref(null);
const $regl = useRegl($canvas, {
  width: props.canvasSize[0],
  height: props.canvasSize[1],
  attributes: {
    // Needed for the corner renderer, as it only affects the alpha channel.
    premultipliedAlpha: false,
    antialias: true,
  },
});

watchEffect(() => {
  const canvas = unref($canvas);
  if (!canvas) return;
  const [width, height] = props.canvasSize;

  canvas.width = width * pxRatio;
  canvas.height = height * pxRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  $regl.value?.({viewport: {}})(() => {
  });
});

// todo:
//     1. switch the background to black
//     2. switch neon color to green (the 3rd option in the cards list)
//     3. Add generic shine glow to background (try by disabling foil or using white surface)
//     4.

const {mouse, onMouseMove, onMouseLeave} = useMousePosition();

const virtualMouse = usePassiveMouseMovement(mouse);

const $tilt = useMouseTilt(virtualMouse);

function usePassiveMouseMovement(mouse) {
  const $now = useNow({interval: 'requestAnimationFrame'});
  const $unhovered = ref(new Date());

  watch(() => mouse.hover, (hovered) => {
    if (!hovered) {
      $unhovered.value = $now.value;
    }
  });

  return computed(() => {
    if (mouse.hover) {
      return mouse;
    } else {
      const t = ($now.value - $unhovered.value) / 1000;
      const scale = [1, 0.4];
      const offset = [0, 0.3];
      const pos = new Vec2(Math.sin(t), -Math.cos(t))
          .multiply(scale)
          .add(offset)
          .add(1)
          .divide(2);
      return {
        x: pos.x,
        y: pos.y,
        hover: false,
      };
    }
  });
}

function useMouseTilt(mouse) {
  const tilt = computed(() => {
    // Tilt is expressed in degrees
    const m = Vec2.fromObject(toValue(mouse)).subtract(0.5).multiply(-100);
    return {
      x: m.x / 1.5,
      y: m.y / 2,
    };
  });
  const springX = useSpring(() => tilt.value.x);
  const springY = useSpring(() => tilt.value.y);
  const distance = useSpring(() => mouse.hover ? props.distanceHover : props.distancePassive, {
    stiffness: 1 / 40,
    damping: 1 / 4,
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
const $cardBuffer = useReglFramebuffer($regl, $cardSize.value.multiply(pxRatio).toSize());

watchEffect(() => {
  const buffer = $cardBuffer.value;
  if (!buffer) return;
  const size = $cardSize.value.multiply(pxRatio);
  buffer.resize(size.x, size.y);
});

const overlayCanvas = makeOffscreenCanvas($cardSize.value.x, $cardSize.value.y);
watchEffect(() => {
  const size = $cardSize.value;
  overlayCanvas.width = size.x * pxRatio;
  overlayCanvas.height = size.y * pxRatio;
  if (overlayCanvas.style) {
    overlayCanvas.style.width = `${size.x}px`;
    overlayCanvas.style.height = `${size.y}px`;
  }
});
const overlay = /** @type {CanvasRenderingContext2D} */ overlayCanvas.getContext('2d');
overlay.textRendering = 'optimizeSpeed';
const $overlayBuffer = useReglTexture($regl, overlayCanvas);
const $title = useScrambledText(() => props.title);
const $subtitle = useScrambledText(() => props.subtitle);
syncScramblers($title.state, $subtitle.state);

watch(() => [props.title, props.subtitle], () => {
  $title.state.reset();
  $subtitle.state.reset();
  $title.state.locked = false;
  $subtitle.state.locked = false;
});

const $avatar = useReglTexture($regl, () => props.avatar);

const $drawCard = computed(() => {
  const regl = unref($regl);
  if (!regl) return null;

  const drawCard = makeCardRenderer(regl, {
    ...$cardSize.value.toSize(),
    cornerRadius: 60 * pxRatio,
    blurRadius: 40 * pxRatio,
    blurSpread: 20 * pxRatio,
  });

  return drawCard;
});

watchEffect(() => {
  const drawCard = unref($drawCard);
  if (!drawCard) return;
  const {x, y} = unref($cardSize);
  drawCard.notifyResize(x, y);
});

watch($glowColor, () => {
  $drawCard.value?.notifyBaseDirty();
});

const $render = computed(() => {
  const regl = /** @type {REGL.Regl} */ unref($regl);
  const background = unref($background);
  const foil = unref($foil);
  const cardBuffer = unref($cardBuffer);
  const overlayBuffer = unref($overlayBuffer);
  if (!regl || !background || !foil || !cardBuffer || !overlayBuffer) return;

  const drawCard = $drawCard.value;
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
    overlay.textAlign = props.textAlign;
    if (props.textShadowColor) {
      overlay.shadowBlur = 20;
      overlay.shadowColor = props.textShadowColor;
    }

    const xCenter = width / 2;

    // Perf: Calling fillText with empty string is much slower than with actual text
    if (title) {
      overlay.font = `${60 * pxRatio}px monospace`;
      const x = props.titleAnchor[0] * width;
      const y = props.titleAnchor[1] * height;
      overlay.fillText(title, x, y);
      if (props.textStrokeWidth && props.textStrokeColor !== '#00000000') {
        const oldBlur = overlay.shadowBlur;
        overlay.shadowBlur = 0;
        overlay.lineWidth = props.textStrokeWidth * pxRatio;
        overlay.strokeStyle = props.textStrokeColor;
        overlay.strokeText(title, x, y);

        overlay.fillText(title, x, y);
        overlay.shadowBlur = oldBlur;
      }
    }
    if (subtitle) {
      overlay.font = `${30 * pxRatio}px monospace`;
      const x = props.subtitleAnchor[0] * width;
      const y = props.subtitleAnchor[1] * height;
      overlay.fillText(subtitle, x, y);
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
    if (background.counter != prevBgCounter) {
      drawCard.notifyBaseDirty();
      prevBgCounter = background.counter;
    }
    // 1. Draw the card content
    cardBuffer.use(() => {
      regl.clear({depth: 1});
      drawCard({
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
              const pos = new Vec2(regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight).multiply(props.avatarAnchor);
              drawAvatar(
                  $avatar.value,
                  props.avatarSize * pxRatio / 2,
                  pos
              );
            }
            mixAdditiveBlend(() => {
              drawName();
              const shadowRepeats = props.textShadowColor ? 5 : 1;
              for (let i = 0; i < shadowRepeats; i++) {
                drawTexture({texture: overlayBuffer});
              }
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
      scale: $cardSize.value.normalized(),
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
</script>
<template>
  <canvas ref="$canvas" @mousemove="onMouseMove" @mouseleave="onMouseLeave" style="height:auto" />
</template>
