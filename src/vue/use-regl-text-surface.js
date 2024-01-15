import {makeOffscreenCanvas} from "../canvas.js";
import {useReglTexture} from "./use-regl-texture.js";
import {ref, toValue, unref, watchEffect} from "vue";

/**
 * @param {import('vue').Ref<REGL.Regl>} $regl
 * @param {import('vue').MaybeRefOrGetter<string>} $text
 * @param {string} font
 * @param {string} color
 * @param {?string} shadowColor
 * @param {?number} shadowBlur
 * @param {?number} padding
 * @param {?number} shadowRepeats
 * @return {[import('vue').ComputedRef<REGL.Texture2D | null>, import('vue').Ref<TextMetrics>]}
 */
export function useReglTextSurface($regl, $text, {
  font = '12px monospace',
  color = 'white',
  shadowColor = color,
  shadowBlur = 0,
  shadowRepeats = 1,
  padding = shadowBlur,
} = {}) {
  const canvas = makeOffscreenCanvas(1, 1);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to create 2d context for useCanvasTextRenderer');

  const $texture = useReglTexture($regl);
  const $info = ref(null);

  function configure() {
    ctx.font = font ?? `12px monospace`;
    ctx.fillStyle = color;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
  }

  configure(ctx);

  watchEffect(() => {
    const texture = unref($texture);
    if (!texture) return;

    // 1. Measure the text
    const text = toValue($text);
    const {
      actualBoundingBoxAscent: top,
      actualBoundingBoxDescent: bottom,
      actualBoundingBoxLeft: left,
      actualBoundingBoxRight: right,
    } = $info.value = ctx.measureText(text);

    // 2. Size the canvas
    canvas.width = left + right + padding * 2;
    canvas.height = top + bottom + padding * 2;
    configure(ctx);

    // 3. Render the text to canvas
    for (let i = 0; i < shadowRepeats; i++) {
      ctx.fillText(text, padding + left, padding + top);
    }

    // 4. Transfer pixels to the texture
    texture(canvas);
  });
  return [$texture, $info];
}
