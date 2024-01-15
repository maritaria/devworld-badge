import {computed, toValue} from "vue";

/**
 * @param {import('vue').Ref<REGL.Regl | null>} $regl
 * @param {import('vue').MaybeRefOrGetter<REGL.Texture2DOptions | undefined>} options
 * @return {import('vue').ComputedRef<REGL.Texture2D | null>}
 */
export function useReglTexture($regl, options) {
  options = toValue(options);
  return computed(() => $regl.value?.texture(options) ?? null);
}
