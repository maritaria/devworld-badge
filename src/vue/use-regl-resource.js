import {computedAsync} from "@vueuse/core";
import {unref} from "vue";
import {loadTexture} from "../regl/utilities.js";

/**
 * @param {import('vue').Ref<REGL.Regl|null>} $regl
 * @param {string} src
 * @param {REGL.Texture2DOptions?} extra
 * @return {import('vue').Ref<REGL.Texture2D>}
 */
export function useReglResource($regl, url, extra = {}) {
  return computedAsync(async () => {
    const regl = unref($regl);
    if (!regl) return;
    return await loadTexture(regl, url, extra);
  });
}
