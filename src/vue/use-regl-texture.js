import {computed, toValue, unref, watchEffect} from "vue";
import {computedAsync} from "@vueuse/core";
import {loadImageFromBlob} from "../regl/utilities.js";
import {createImage} from "../resources.js";

/**
 * Provide a {REGL.Texture2D} that is bound to a given source.
 * The created texture reactively updates if the source is changed.
 * Note that the source is watched in a shallow manner.
 *
 * @param {import('vue').Ref<REGL.Regl>} $regl
 * @param {import('vue').MaybeRefOrGetter<REGL.TextureImageData|Blob|string>} $src
 * @param {REGL.Texture2DOptions?} options
 * @return {ComputedRef<REGL.Texture2D|undefined>}
 */
export function useReglTexture($regl, $src, options) {
  /** @type {ComputedRef<REGL.Texture2D|undefined>} */
  const $texture = computed(() => unref($regl)?.texture());
  const $image = computedAsync(async () => {
    const src = toValue($src);
    if (!src) return undefined;

    if (src instanceof Blob) {
      return await loadImageFromBlob(src);
    } else if (typeof src == 'string') {
      return await createImage(src);
    } else {
      return src;
    }
  });
  watchEffect(async (cleanup) => {
    const texture = $texture.value;
    const image = $image.value;
    if (texture && image) {
      texture({data: image, ...options});
    }
  });
  return $texture;
}
