<script setup>
import {computed, reactive, ref, unref, watch, watchEffect} from 'vue';
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
import {frameLoop, loadImageFromBlob, loadTextureFromBlob} from "../regl/utilities.js";
import AvatarPicker from "./AvatarPicker.vue";
import {createImage} from "../resources.js";
import {makeAvatarRenderer} from "../regl/avatar-renderer.js";
import {useReglTextSurface} from "../vue/use-regl-text-surface.js";
import {makeSpriteRenderer} from "../regl/sprite-renderer.js";
import {useScrambledText} from "../vue/use-scrambled-text.js";

const $canvas = ref(null);
const cardSize = new Vec2(400, 564).multiply(2).round();
const avatarSize = 400;
const distancePassive = 1.5;
const distanceHover = 1.2;
const $regl = useRegl($canvas, {
  ...cardSize.toSize(), pixelRatio: 1,
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
    // 1. Update and prepare the matrix rain layer
    rainDraw();
    // 2. Render the card to a framebuffer
    cardBuffer.use(() => {
      regl.clear({depth: 1});
      drawCard({
        ...resources,
        mouse,
        layers: () => {
          noDepth(() => {
            mixPlusLighter(() => {
              drawTexture({texture: rainBuffer});
            });
            if ($avatar.value) {
              const bufferSize = new Vec2(regl._gl.drawingBufferWidth, regl._gl.drawingBufferHeight);
              const avatarPos = bufferSize.multiply([0.5, 0.4]);
              drawAvatar($avatar.value, avatarSize / 2, avatarPos);
            }
            if ($nameSurface.value) {
              mixAdditiveBlend(() => {
                const surface = $nameSurface.value;
                const size = new Vec2(surface.width, $nameSurfaceInfo.value.actualBoundingBoxAscent);

                // TODO: Improve performance by allowing sprite rendering using source rects. Then avoid resizing the canvas for reglTextSurface.
                drawSprite($nameSurface.value, {
                  position: cardBufferSize.multiply([0.5, 0.7]),
                  anchor: $nameAnchor.value,
                  scale: 2,
                });
              });
            }
          });
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

const $settings = reactive({
  text: {
    font: '40px monospace',
    padding: 5,
  },
});

const $name = ref('Bram Kamies');
const nameFont = '40px monospace';
const $scramble = useScrambledText($name);
const [$nameSurface, $nameSurfaceInfo] = useReglTextSurface($regl, $scramble, {
  font: $settings.text.font,
  padding: $settings.text.padding,
  shadowBlur: 5,
  shadowColor: 'deepskyblue',
  shadowRepeats: 5,
});
const nameFinalSizeCanvas = makeOffscreenCanvas(1, 1);
const $nameFinalSize = computed(() => {
  const ctx = nameFinalSizeCanvas.getContext('2d');
  if (!ctx) throw new Error('Failed to create 2d');
  ctx.font = $settings.text.font;
  const {
    actualBoundingBoxAscent: top,
    actualBoundingBoxDescent: bottom,
    actualBoundingBoxLeft: left,
    actualBoundingBoxRight: right,
  } = ctx.measureText($name.value);
  return new Vec2(
      left + right + $settings.text.padding * 2,
      top + bottom + $settings.text.padding * 2,
  );
});
const $nameAnchor = computed(() => {
  const {
    actualBoundingBoxAscent: top,
    actualBoundingBoxDescent: bottom,
  } = $nameSurfaceInfo.value;
  const padding = $settings.text.padding;
  return [0.5, top / (top+bottom + padding*2)];
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
  <h1>To-do list</h1>
  <ol>
    <li><input type="checkbox" readonly>Display name</li>
    <li><input type="checkbox" readonly>Fix touch gestures on mobile</li>
    <li><input type="checkbox" readonly>Fix avatar pixelation (specifically of the preset images)</li>
    <li><input type="checkbox" readonly checked>Fix upload button not visible on mobile</li>
  </ol>
</template>
