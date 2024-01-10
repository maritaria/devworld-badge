<script setup>
import {computed, ref, unref, watchEffect} from "vue";
import {useRegl} from "../vue/use-regl.js";
import {computedAsync, useNow} from "@vueuse/core";
import {makeTextureRenderer} from "../regl/texture-renderer.js";
import {createHtmlTexture} from "../resources.js";

/** @type import('vue').Ref<HTMLCanvasElement> */
const $canvas = ref();
/** @type import('vue').Ref<REGL.Regl> */
const $regl = useRegl($canvas, {width: 300, height: 300});

const $render = computedAsync(async () => {
  const regl = unref($regl);
  if (!regl) return;
  const texture = await loadMyTexture(regl);
  makeTextureRenderer(regl)({texture});
});

const $now = useNow({interval: 'requestAnimationFrame'});
const $text = computed(() => $now.value.toISOString());

watchEffect(() => {
  if ($render.value && $text.value) {
    $render.value($text.value);
  }
});

async function loadMyTexture(regl) {
  // language=css
  const css = `
    .name {
      max-width: 100%;
      text-align: center;
      font-size: 40px;
      font-family: monospace;
      color: white;
      text-shadow: cyan 0 0 5px, skyblue 0 0 10px, deepskyblue 0 0 5px;
      padding: 10px;
      border: 1px solid white;
      text-rendering: optimizeLegibility;
    }
  `;
  // language=html
  const html = `<div class="name">Bram Kamies</div>`;
  return await createHtmlTexture(regl, 300, 300,`${html}<style>${css}</style>`);
}

</script>

<template>
  <canvas ref="$canvas" />
</template>

<style scoped>

</style>
