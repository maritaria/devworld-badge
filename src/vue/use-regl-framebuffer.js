import {computed, toValue, unref, watch} from "vue";
import {autoDestroy} from "./regl-auto-destroy.js";

/**
 * @param {import('vue').Ref<REGL.Regl>} $regl
 * @param {import('vue').MaybeRefOrGetter<REGL.FramebufferOptions>} $options
 * @return {import('vue').ComputedRef<REGL.Framebuffer2D|null>}
 */
export function useReglFramebuffer($regl, $options) {
  const $buffer = computed(() => unref($regl)?.framebuffer(toValue($options)) ?? null);
  autoDestroy($buffer);
  return $buffer;
}
