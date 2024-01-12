<script setup>
import {computed, onMounted, reactive, ref, unref, watch} from "vue";
import {useRafFn} from "@vueuse/core";
import {useSpring} from "../vue/use-spring.js";

const $canvas = ref(null);
const $value = ref(20);
const $spring = useSpring(() => $value.value);

</script>

<template>
  <div style="display:flex;flex-direction: column">
    <span>Value: {{ $value }}</span>
    <input type="range" min="0" max="100" v-model="$value">
    <span>Spring: {{ $spring }}</span>
    <input type="range" min="0" max="100" :value="$spring">
  </div>
</template>

<style scoped>

</style>
