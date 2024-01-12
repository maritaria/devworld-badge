<script setup>
import {computed, ref} from "vue";

/** @type {import('vue').Ref<string>} */
const $text = ref('');
/** @type {import('vue').Ref<HTMLCanvasElement|null>} */
const $canvas = ref(null);
/** @type {import('vue').ComputedRef<CanvasRenderingContext2D|null>} */
const $ctx = computed(() => $canvas.value?.getContext('2d') ?? null);


</script>

<template>
  <label>
    Text:
    <input type="text" v-model="$text">
  </label>
  <canvas ref="$canvas" />
</template>

