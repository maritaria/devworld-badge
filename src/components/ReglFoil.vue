<script setup>
import {onMounted, reactive, ref, watchEffect} from "vue";
import createREGL from 'regl';
import badgeImg from '../assets/doc/niki-devworld-badge-sample-3.jpg';
import foilUrl from '../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg';
import {linearGradientLength} from "../linear-gradient.js";
import {Vec2} from "../Vec2.js";

const $canvas = ref(null);

const render = ref(null);

onMounted(async () => {
  if (!$canvas.value) throw Error("Missing ref($canvas)");
  const regl = createREGL($canvas.value);
  const badge = await loadTexture(regl, badgeImg);
  const foil = await loadTexture(regl, foilUrl);
  const drawImage = makeMaskRender(regl);
  const defaultProps = {
    mouse: [0,0],
    foil,
    card: badge,
  };
  render.value = (props) => drawImage({...defaultProps, ...props});
  render.value();
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
 * @param src
 * @return {Promise<REGL.Texture2D>}
 */
function makeMaskRender(regl) {
  return regl({
    // language=GLSL
    vert: `
    precision highp float;
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      gl_Position = vec4(position, 0, 1);
      uv = position;
    }
    `,
    // language=GLSL
    frag: `
      precision highp float;
      varying vec2 uv;
      uniform vec2 mouse;
      uniform vec2 screen;
      uniform float linearGradientLength;
      uniform sampler2D foil;
      uniform sampler2D card;

      vec2 findFarthestCorner(vec2 mouse, vec2 ratio) {
        return vec2(
        mouse.x < 0.0 ? ratio.x : -ratio.x,
        mouse.y < 0.0 ? ratio.y : -ratio.y
        );
      }

      float progress(float value, float min, float max) {
        float range = max - min;
        return (value - min) / range;
      }

      float remap(float value, float fromMin, float fromMax, float toMin, float toMax) {
        return mix(toMin, toMax, progress(value, fromMin, fromMax));
      }

      vec3 radialGradient(vec2 uv, vec2 mouse, vec2 ratio) {
        // background-size of radial-gradient = 120% 120 %
        uv /= vec2(1.2);

        // Find farthest corner
        vec2 farthestCorner = findFarthestCorner(mouse, ratio);
        // Distance from circle center
        float dm = distance(uv, mouse);
        // Distance from circle center to corner
        float dc = distance(mouse, farthestCorner);
        // Fractional distance of pixel in the range [center, corner]
        float d = dm / dc;
        // Compute the gradient progress
        // <5% = white
        if (d < 0.05) return vec3(1.0);
        // >80% = white
        if (d > 0.8) return vec3(1.0);
        // 5% (white) .. 50% (black) .. 80% (white)
        if (d > 0.5) {
          // 50%..80% (black..white)
          return vec3(remap(d, 0.5, 0.8, 0.0, 1.0));
        } else {
          // 5%..50% (white..black)
          return vec3(remap(d, 0.05, 0.5, 1.0, 0.0));
        }
      }

      #define WHITE vec3(1.0)
      #define BLACK vec3(0.0)

      /**
       * uv: [-1, 1]
       * mouse [-1, 1]
       * ratio: [-1, 1]
       */
      vec3 linearGradient(vec2 uv, vec2 mouse, vec2 ratio, float gradientLength) {
        // background-size: 200% 200%
        // background-position: var(--pointer-x) var(--pointer-y)
        // background-blend-mode: difference

        vec2 topLeft = vec2(-1, 1) * ratio * 2.0;
        vec2 bottomRight = vec2(1.0, -1.0) * ratio * 2.0;
        vec2 range = bottomRight - topLeft;
        float totalDistance = max(range.x, range.y);
        totalDistance *= gradientLength;

        vec2 pos = uv + mouse;
        // Because the linear-gradient is 45 degrees (from top-left to bottom-right),
        // the offset can be calculated as x-y
        float progress = (pos.x - pos.y) / totalDistance;
        // Double the size of the beam, to account for 200% size
        progress *= 0.5;

        // The center of the beam is at progress=0.5, so bump the progress so the center is at [0, 0]
        progress += 0.5;

        // background-image: linear-gradient( -45deg, #000 15%, #fff 50%, #000 85% )
        if (progress < 0.5) {
          return vec3(remap(progress, 0.15, 0.5, 0.0, 1.0));
        } else {
          return vec3(remap(progress, 0.5, 0.85, 1.0, 0.0));
        }
      }

      float softLight(float Cb, float Cs) {
        if (Cs <= 0.5) {
          return Cb - (1.0 - 2.0 * Cs) * Cb * (1.0 - Cb);
        } else {
          float D = (Cb <= 0.25)
          ? ((16.0 * Cb - 12.0) * Cb + 4.0) * Cb
          : sqrt(Cb);

          return Cb + (2.0 * Cs - 1.0) * (D - Cb);
        }
      }

      vec3 softLight(vec3 backdrop, vec3 source) {
        return vec3(
        softLight(backdrop.r, source.r),
        softLight(backdrop.g, source.g),
        softLight(backdrop.b, source.b)
        );
      }

      vec3 difference(vec3 backdrop, vec3 source) {
        return abs(backdrop - source);
      }

      vec3 sampleTexture(sampler2D source, vec2 uv, vec2 ratio) {
        // TODO: pre-scale the foil so it is not as pixelated
        vec2 foilUV = ((uv * vec2(1.0, -1.0) / ratio) + vec2(1.0)) / 2.0;
        return texture2D(source, foilUV).rgb;
      }

      vec3 adjustBrightness(float brightness, vec3 image) {
        return image * brightness;
      }

      vec3 adjustContrast(float contrast, vec3 image) {
        // <feFunc{R,G,B} type="linear" slope="[amount]" intercept="-(0.5 * [amount]) + 0.5"/>
        // linear -> C' = slope * C + intercept
        float slope = contrast;
        float intercept = -(0.5 * contrast) + 0.5;
        return slope * image + intercept;
      }

      vec3 adjustSaturation(float s, vec3 image) {
        // <feColorMatrix type="saturate" values="[amount]"/>
        mat3 matrix = mat3(
        0.213 + 0.787*s, 0.715 - 0.715*s, 0.072 - 0.072*s,
        0.213 - 0.213*s, 0.715 + 0.285*s, 0.072 - 0.072*s,
        0.213 - 0.213*s, 0.715 - 0.715*s, 0.072 + 0.928*s
        );
        return image * matrix;
      }

      float colorDodge(float backdrop, float source) {
        // https://drafts.fxtf.org/compositing/#valdef-blend-mode-color-dodge
        if (backdrop == 0.0)
        return 0.0;
        else if (source >= 1.0)
        return 1.0;
        else
        return min(1.0, backdrop / (1.0 - source));
      }

      vec3 colorDodge(vec3 backdrop, vec3 source) {
        return vec3(
        colorDodge(backdrop.r, source.r),
        colorDodge(backdrop.g, source.g),
        colorDodge(backdrop.b, source.b)
        );
      }

      void main() {
        // Shadow variables to make them mutable
        vec2 uv = uv;
        vec2 mouse = mouse;

        // Adjust uv and mouse so the [-1, 1] ranges are now ratio aware and [-1, 1] matches the longest side
        vec2 ratio = vec2(
        min(1.0, screen.x / screen.y),
        min(1.0, screen.y / screen.x)
        );
        uv *= ratio;
        mouse *= ratio;

        // background-*:

        vec3 layer3 = radialGradient(uv, mouse, ratio);
        vec3 layer2 = linearGradient(uv, mouse, ratio, linearGradientLength);
        vec3 layer1 = sampleTexture(foil, uv, ratio);

        vec3 combine23 = softLight(layer2, layer3);
        vec3 combine12 = difference(layer1, layer2);

        vec3 background = softLight(difference(layer1, layer2), layer3);

        // filter: brightness(0.6) contrast(1.5) saturate(1);
        vec3 filtered = adjustSaturation(1.0, adjustContrast(1.5, adjustBrightness(0.6, background)));

        // mix-blend-mode: dodge
        vec3 base = sampleTexture(card, uv, ratio);
        vec3 dodged = colorDodge(base, filtered);

        gl_FragColor = vec4(dodged, 1);
      }
    `,
    attributes: {
      position: [[1, 1], [-3, 1], [1, -3]],
    },
    uniforms: {
      screen: function (context, props) {
        return [
          context.viewportWidth,
          context.viewportHeight,
        ];
      },
      linearGradientLength: function (context, props) {
        const angle = -45;
        const length = linearGradientLength(context.viewportWidth, context.viewportHeight, angle);
        // Define the gradient length as [0,1] relative to the longest side.
        return length / Math.max(context.viewportWidth, context.viewportHeight);
      },
      mouse: regl.prop('mouse'), // Position of mouse as [-1, 1] for x and y.
      foil: regl.prop('foil'),
      card: regl.prop('card'),
    },
    count: 3,
  });
}

const mouse = reactive({x: 0, y: 0});

/** @param {MouseEvent} event */
function onMouseMove(event) {
  if (!$canvas.value) return;
  const rect = $canvas.value.getBoundingClientRect();
  const absolute = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  mouse.x = Math.remap(absolute.x, 0, rect.width, -1, 1);
  mouse.y = Math.remap(absolute.y, 0, rect.height, 1, -1);
}

/** @param {MouseEvent} event */
function onMouseLeave(event) {
  mouse.x = 0;
  mouse.y = 0;
}

watchEffect(() => {
  if (!render.value) return;
  console.log('render', mouse.x.toFixed(2), mouse.y.toFixed(2));
  render.value({
    mouse: [mouse.x, mouse.y],
  });
  applyTilt(window.app, {x: (mouse.x + 1) / 2 * 100, y: (-mouse.y + 1) / 2 * 100});
});

</script>

<template>
  <canvas ref="$canvas" width="400" height="564" @mousemove="onMouseMove" @mouseleave="onMouseLeave" />
</template>

<style scoped>

</style>
