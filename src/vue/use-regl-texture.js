import {computed, ref, toValue, unref, watch, watchEffect} from "vue";
import {computedAsync} from "@vueuse/core";
import {loadImageFromBlob} from "../regl/utilities.js";
import {createImage} from "../resources.js";
import {FramebufferOptions} from "regl";
import {autoDestroy} from "./regl-auto-destroy.js";

/**
 * Provide a {@link REGL.Texture2D} that is bound to a given source.
 * The created texture reactively updates if the source is changed.
 * Note that the source is watched in a shallow manner.
 *
 * @param {import('vue').Ref<REGL.Regl>} $regl
 * @param {import('vue').MaybeRefOrGetter<REGL.TextureImageData|Blob|string>} $src
 * @param {REGL.Texture2DOptions?} options
 * @return {import('vue').Ref<(REGL.Texture2D&{counter:number})|undefined>}
 */
export function useReglTexture($regl, $src, options) {
  /** @type {import('vue').Ref<REGL.Texture2D|undefined>} */
  const $texture = ref(null);
  autoDestroy($texture);

  // Load image data from $src
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

  // Patch $texture when loaded image updates
  watchEffect(() => {
    const regl = unref($regl);
    const image = unref($image);
    if (!regl || !image) return;

    const init = {data: image, ...options};
    if ($texture.value) {
      // Update texture
      $texture.value(init);
      $texture.value.counter++;
    } else {
      // Init texture
      $texture.value = regl.texture(init);
      $texture.value.counter = 0;
    }
  });

  return $texture;
}
