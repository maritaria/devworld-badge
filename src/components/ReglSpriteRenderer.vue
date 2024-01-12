<script setup>
import {computed, ref, unref, watchEffect} from "vue";
import {useRegl} from "../vue/use-regl.js";
import {useReglResource} from "../vue/use-regl-resource.js";
import spriteUrl from "../assets/silhouette_1.jpeg";
import {makeSpriteRenderer} from "../regl/sprite-renderer.js";
import {noop} from "@vueuse/core";
import {Vec2} from "../Vec2.js";

const $canvas = ref(null);
const $regl = useRegl($canvas, {
  width: 300,
  height: 300,
  pixelRatio: 1,
});
const $sprite = useReglResource($regl, spriteUrl);

const $render = computed(() => {
  const regl = unref($regl);
  return regl ? makeSpriteRenderer(regl) : null;
});

watchEffect(() => {
  const render = unref($render);
  const sprite = unref($sprite);
  if (render && sprite) {
    render(sprite, new Vec2(100), new Vec2(100));
  }
});

</script>

<template>
  <canvas ref="$canvas" />
</template>

<style scoped>
canvas {
  border: 1px solid white;
}
</style>
