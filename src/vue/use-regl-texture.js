import {computed, toValue} from "vue";

export function useReglTexture($regl, options) {
  options = toValue(options);
  return computed(() => $regl.value?.texture(options) ?? null);
}
