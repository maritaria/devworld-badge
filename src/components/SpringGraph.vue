<script setup>
import {computed, onMounted, reactive, ref, unref, watch} from "vue";
import {useRafFn} from "@vueuse/core";
import {useSpring} from "../use-spring.js";

const $canvas = ref(null);
const $value = ref(20);
const $spring = useSpring(() => $value.value);

</script>

<template>
  <span>Value: {{ $value }}</span>
  <input type="range" min="0" max="100" v-model="$value">
  <span>Spring: {{ $spring }}</span>
  <input type="range" min="0" max="100" :value="$spring">
</template>

<style scoped>

</style>
