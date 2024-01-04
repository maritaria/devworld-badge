<script setup>
import {computed, onMounted, reactive, ref, unref, watch} from "vue";
import {useRafFn} from "@vueuse/core";
import {useSpring} from "../use-spring.js";

const $canvas = ref(null);
const $value = ref(20);
const $spring = useSpring(() => $value.value);

onMounted(() => {
  if (!$canvas.value) throw new Error('Missing $canvas');

  renderGraph($canvas.value);

});

/** @param {HTMLCanvasElement} canvas */
function renderGraph(canvas) {

}
</script>

<template>
  <canvas ref="$canvas" width="300" height="300" />
  <input type="range" min="0" max="100" v-model="$value">
  <span>Value: {{ $value }}</span>
  <span>Spring: {{ $spring }}</span>
  <input type="range" min="0" max="100" :value="$spring">
</template>

<style scoped>

</style>
