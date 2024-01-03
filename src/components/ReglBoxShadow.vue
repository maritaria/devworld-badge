<script setup>
import {onMounted, reactive, ref, watchEffect} from "vue";
import createREGL from 'regl';
import badgeImg from '../assets/doc/niki-devworld-badge-sample-3.jpg';
import foilUrl from '../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg';
import {linearGradientLength} from "../linear-gradient.js";
import {Vec2} from "../Vec2.js";
import {loadTexture} from "../regl/utilities.js";

const $canvas = ref(null);
const size = reactive({ width: 400 * 2, height: 564 * 2 });

onMounted(async () => {
  if (!$canvas.value) throw Error("Missing ref($canvas)");
  const regl = createREGL($canvas.value);
  const base = await loadTexture(regl, badgeImg);
  const drawImage = makeShadowRender(regl);
  drawImage({base, cornerRadius: 30});
});

/**
 * @param {REGL.Regl} regl
 * @param src
 * @return {Promise<REGL.Texture2D>}
 */
function makeShadowRender(regl) {
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
      uniform vec2 screen;
      uniform float cornerRadius;
      uniform sampler2D base;

      #define ZERO vec2(0)
      #define ONE vec2(1)
      #define RED vec3(1, 0, 0)
      #define GREEN vec3(0, 1, 0)
      #define BLUE vec3(0, 0, 1)
      #define BLACK vec3(0)
      #define WHITE vec3(1)

      vec3 sampleTexture(sampler2D source, vec2 uv, vec2 ratio) {
        // TODO: pre-scale the foil so it is not as pixelated
        vec2 foilUV = ((uv * vec2(1.0, -1.0) / ratio) + vec2(1.0)) / 2.0;
        return texture2D(source, foilUV).rgb;
      }

      vec2 flipY(vec2 pos, float maxY) {
        return vec2(pos.x, maxY - pos.y);
      }

      float max(float a, float b, float c) {
        return max(max(a, b), c);
      }

      float sdRoundedBox(in vec2 centerDelta, in vec2 size, in float cornerRadius) {
        // Source: https://iquilezles.org/articles/distfunctions2d/
        vec2 q = abs(centerDelta) - (size / 2.0) + cornerRadius;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - cornerRadius;
      }

      float shape(vec2 pos, vec2 topleft, vec2 bottomright, float radius) {
        vec2 size = bottomright - topleft;
        vec2 center = (topleft + bottomright) / 2.0;
        vec2 delta = pos - center;
        return sdRoundedBox(delta, size, radius);
      }

      float normpdf(in float x, in float sigma) {
        return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
      }

      vec3 insetBoxShadow(vec2 pos, vec2 topleft, vec2 bottomright, float cornerRadius, vec3 shadow_color) {
        const float factor = 2.0;
        const float blurRadius = 20.0 * factor;
        const float blurSpread = 10.0 * factor;
        vec3 color_inside = BLACK;
        vec3 color_outside = shadow_color;

        // Gaussian blur - https://www.shadertoy.com/view/XdfGDH
        float sigma = blurRadius / 2.0;
        const int mSize = int(blurRadius);
        const int kSize = mSize / 2;

        // 1. Create the 1D kernel
        float kernel[mSize+1];
        for (int x = 0; x <= kSize; ++x) {
          kernel[kSize+x] = kernel[kSize-x] = normpdf(float(x), sigma);
        }

        // Run the kernel
        vec3 result = vec3(0.0);
        float Z = 0.0;
        for (int x = -kSize; x <= kSize; ++x) {
          for (int y = -kSize; y <= kSize; ++y) {
            // Use the distance function to determine the colors being mixed.
            vec2 cell_pos = pos + vec2(x, y);
            float cell_distance = shape(cell_pos, topleft, bottomright, cornerRadius);
            float cell_mix = clamp(cell_distance + blurSpread, -1.0, 1.0) * 0.5 + 0.5;
            // Mix between the inside and outside colors.
            // The mix is needed for pixels that are closer by than 1 pixel (happens at the corners).
            vec3 cell_color = mix(color_inside, color_outside, cell_mix);
            // Sum using kernel factors
            result += kernel[kSize+y] * kernel[kSize+x] * cell_color;
            // Track the normalization factor
            Z += kernel[kSize+y] * kernel[kSize+x];
          }
        }
        // Normalize the value range
        result /= Z;
        return result;
      }

      void main() {
        // Flip Y, so it matches screen coodinate space
        vec2 uv = vec2(uv.x, -uv.y);
        // Remap uv from [-1..1] to [0..1]
        vec2 uvNorm = (1.0 + uv) / 2.0;
        // Express uv as pixel coordinate
        vec2 pixel = uvNorm * screen;

        // Get the starting color
        vec3 background = texture2D(base, uvNorm).rgb;
        gl_FragColor.rgb = background;

        // --border-glow-inside: deepskyblue; // .dev-world.blue
        // box-shadow: var(--border-glow-inside) 0 0 20px 10px inset;
        vec3 deepskyblue = vec3(0.0, 191.0 / 255.0, 1.0);// #00BFFF
        vec3 boxShadow = insetBoxShadow(pixel, ZERO, screen, cornerRadius, deepskyblue);

        // Additive blend over the base
        gl_FragColor.rgb += boxShadow;

        // Force alpha channel
        gl_FragColor.a = 1.0;
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
      base: regl.prop('base'),
      cornerRadius: regl.prop('cornerRadius'),
    },
    count: 3,
  });
}
</script>

<template>
  <canvas ref="$canvas" :width="size.width" :height="size.height" />
</template>

<style scoped>

</style>
