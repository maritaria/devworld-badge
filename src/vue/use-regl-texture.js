import {computed, toValue, unref} from "vue";
import {computedAsync} from "@vueuse/core";
import {loadTexture} from "../regl/utilities.js";

/**
 * @param {import('vue').Ref<REGL.Regl|null>} $regl
 * @param {string} url
 * @param {REGL.Texture2DOptions?} extra
 * @return {import('vue').Ref<REGL.Texture2D>}
 */
export function useReglTexture($regl, url, extra) {
  return computedAsync(async () => {
    const regl = unref($regl);
    if (!regl) return;
    return await loadTexture(regl, url, extra);
  });
}
