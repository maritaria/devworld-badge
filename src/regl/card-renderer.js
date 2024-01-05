import {linearGradientLength} from "../linear-gradient.js";
import {loadTexture} from "./utilities.js";
import imageUrl from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import foilUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";

/**
 * @param {REGL.Regl} regl
 * @return {Promise<{image: REGL.Texture2D, foil: REGL.Texture2D}>}
 */
export async function loadCardResources(regl) {
  const image = await loadTexture(regl, imageUrl);
  const foil = await loadTexture(regl, foilUrl, {flipY: true});
  return {image, foil};
}

/**
 * @typedef {{
 *   image: REGL.Texture2D,
 *   foil: REGL.Texture2D,
 *   mouse?: [number, number],
 * }} RenderCardProps
 * @typedef {function(props: RenderCardProps): void} RenderCardFn
 */

/**
 * @param {REGL.Regl} regl
 * @return {RenderCardFn}
 */
export function makeCardRenderer(regl, {
  width,
  height,
  cornerRadius = 30,
  blurRadius = 20,
  blurSpread = 15,
} = {}) {

  const drawImage = makeImageRenderer(regl);
  const drawShadow = makeShadowRenderer(regl, blurRadius, blurSpread);
  const drawFoil = makeFoilRenderer(regl);
  const drawCorners = makeCornerRenderer(regl);

  let stage1 = null;
  return function RenderCard(props) {
    initStage1(props.image);
    drawFoil({
      card: stage1,
      foil: props.foil,
      mouse: props.mouse ?? [1, 1],
    });
    drawCorners({cornerRadius});
  };

  function initStage1(image) {
    if (stage1) return;
    stage1 = regl.framebuffer(width, height);
    stage1.use(() => {
      regl.clear({depth: 1});
      drawImage({image});
      drawShadow({cornerRadius});
    });
  }
}

/**
 * @param {REGL.Regl} regl
 * @returns {REGL.DrawCommand}
 */
function makeImageRenderer(regl) {
  return regl({
    count: 3,
    attributes: {
      position: [[1, 1], [-3, 1], [1, -3]],
    },
    uniforms: {
      image: regl.prop('image'),
    },
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
      uniform sampler2D image;

      void main() {
        // Flip Y, so it matches screen coodinate space
        vec2 uv = vec2(uv.x, -uv.y);
        // Remap uv from [-1..1] to [0..1]
        vec2 imageUV = (1.0 + uv) / 2.0;
        // Sample the texture
        gl_FragColor = texture2D(image, imageUV);
      }
    `,
  });
}

/**
 * @param {REGL.Regl} regl
 * @param {number} blurRadius
 * @param {number} blurSpread
 * @return {REGL.DrawCommand}
 */
function makeShadowRenderer(regl, blurRadius = 20, blurSpread = 10) {
  return regl({
    count: 3,
    attributes: {
      position: [[1, 1], [-3, 1], [1, -3]],
    },
    uniforms: {
      screen: function (context, props) {
        return [
          context.drawingBufferWidth,
          context.drawingBufferHeight,
        ];
      },
      cornerRadius: regl.prop('cornerRadius'),
    },
    // Additive blending
    blend: {
      enable: true,
      equation: 'add',
      func: {src: 'one', dst: 'one'},
    },
    depth: {enable: false},
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
        const float blurRadius = ${blurRadius.toFixed(1)};
        const float blurSpread = ${blurSpread.toFixed(1)};

        vec3 color_inside = vec3(0);
        vec3 color_outside = shadow_color;

        // Gaussian blur - https://www.shadertoy.com/view/XdfGDH
        float sigma = blurRadius / 1.5;
        const int mSize = int(blurRadius);
        const int kSize = mSize / 2;

        // 1. Create the 1D kernel
        float kernel[mSize+1];

        for (int x = 0; x <= kSize; ++x) {
          kernel[kSize+x] = kernel[kSize-x] = normpdf(float(x), sigma);
        }

        // Collect the normalization factor
        float Z = 0.0;
        for (int i = 0; i <= mSize; i++) {
          Z += kernel[i];
        }

        // Run the kernel
        vec3 result = vec3(0.0);
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
          }

        }
        // Normalize the value range
        result /= Z*Z;
        return result;
      }

      void main() {
        // uv: [0..1] in viewport space
        vec2 uv = uv * vec2(1, -1) / 2.0 + 0.5;
        vec2 pixel = uv * screen;

        // --border-glow-inside: deepskyblue; // .dev-world.blue
        // box-shadow: var(--border-glow-inside) 0 0 20px 10px inset;
        vec3 deepskyblue = vec3(0.0, 191.0 / 255.0, 1.0);// #00BFFF
        vec3 boxShadow = insetBoxShadow(pixel, vec2(0), screen, cornerRadius, deepskyblue);

        // Write out the color, should be additively blended
        gl_FragColor += vec4(boxShadow, 1.0);
      }
    `,
  });
}

/**
 * @param {REGL.Regl} regl
 * @return {REGL.DrawCommand}
 */
function makeFoilRenderer(regl) {
  return regl({
    count: 3,
    attributes: {
      position: [[1, 1], [-3, 1], [1, -3]],
    },
    uniforms: {
      screen: (context, props) => [context.viewportWidth, context.viewportHeight],
      card: regl.prop('card'),
      foil: regl.prop('foil'),
      mouse: regl.prop('mouse'),
      linearGradientLength: function (context) {
        const angle = -45;
        const length = linearGradientLength(context.viewportWidth, context.viewportHeight, angle);
        // Define the gradient length as [0,1] relative to the longest side.
        return length / Math.max(context.viewportWidth, context.viewportHeight);
      },
    },
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
      uniform vec2 mouse;
      uniform float linearGradientLength;
      uniform sampler2D card;
      uniform sampler2D foil;

      #define ZERO vec2(0)
      #define ONE vec2(1)
      #define RED vec3(1, 0, 0)
      #define GREEN vec3(0, 1, 0)
      #define BLUE vec3(0, 0, 1)
      #define BLACK vec3(0)
      #define WHITE vec3(1)

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
        vec2 foilUV = ((uv * vec2(1.0, 1.0) / ratio) + vec2(1.0)) / 2.0;
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
        // Remap UV from screen-space [-1..1] to texture-space [0..1]
        vec2 cardUV = (uv / 2.0 + 0.5);
        gl_FragColor = vec4(1) - texture2D(card, cardUV);
        gl_FragColor = texture2D(foil, cardUV);
        gl_FragColor.a = 1.0;

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

        vec3 layer3 = radialGradient(uv, mouse, ratio);
        vec3 layer2 = linearGradient(uv, mouse, ratio, linearGradientLength);
        vec3 layer1 = sampleTexture(foil, uv, ratio);
        vec3 background = softLight(difference(layer1, layer2), layer3);

        // filter: brightness(0.6) contrast(1.5) saturate(1);
        vec3 filtered = adjustSaturation(1.0, adjustContrast(1.5, adjustBrightness(0.6, background)));

        // mix-blend-mode: dodge
        vec3 base = sampleTexture(card, uv, ratio);
        vec3 dodged = colorDodge(base, filtered);

        gl_FragColor = vec4(dodged, 1);
      }
    `,
  });
}

/**
 * @param {REGL.Regl} regl
 * @return {REGL.DrawCommand}
 */
function makeCornerRenderer(regl) {
  return regl({
    count: 3,
    attributes: {
      position: [[1, 1], [-3, 1], [1, -3]],
    },
    uniforms: {
      cornerRadius: regl.prop('cornerRadius'),
      screen: (context) => [context.drawingBufferWidth, context.drawingBufferHeight],
    },
    depth: {enable: false},
    // Blend-mode: multiply by alpha
    blend: {
      enable: true,
      equation: 'add',
      func: {
        srcRGB: 'zero',
        dstRGB: 'one',
        srcAlpha: 'one',
        dstAlpha: 'zero',
      },
    },
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

      void main() {
        // uv: [0..1] in viewport space
        vec2 uv = uv * vec2(1, -1) / 2.0 + 0.5;
        vec2 pixel = uv * screen;
        float distance = shape(pixel, vec2(0), screen, cornerRadius);
        gl_FragColor = vec4(1);
        gl_FragColor.a = clamp(-distance, 0.0, 1.0);
      }
    `,

  });
}
