import {computed, ref, toValue, unref, watch} from "vue";
import createREGL from "regl";
import {pxRatio} from "../canvas.js";

/**
 * @param {import('vue').WatchSource<HTMLCanvasElement>} $canvas
 * @param {number} width
 * @param {number} height
 * @param {number} pixelRatio
 * @param {string[]} extensions
 * @param {WebGLContextAttributes} attributes
 * @return {import('vue').Ref<REGL.Regl>}
 */
export function useRegl(
  $canvas,
  {
    width,
    height,
    pixelRatio = pxRatio,
    extensions = [],
    attributes = {},
  } = {}
) {
  const $regl = ref(null);
  watch($canvas, onCanvasSet);
  return $regl;
  /** @param {HTMLCanvasElement} canvas */
  function onCanvasSet(canvas) {
    if (!canvas) return;
    // Init canvas
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    // Init Regl
    const regl = createREGL({
      canvas,
      pixelRatio,
      attributes: {
        alpha: true,
        powerPreference: 'high-performance',
        ...attributes,
      },
      extensions,
    });
    $regl.value = regl;
  }
}
