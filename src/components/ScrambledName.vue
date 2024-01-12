<script setup>
import {reactive, ref, watch, watchEffect} from "vue";
import {useIntervalFn} from "@vueuse/core";
import {ScrambledText} from "../scrambled-text.js";

const props = defineProps({
  text: {default: ''},
});
const $text = ref('');
const state = new ScrambledText();

watchEffect(() => {
  state.target = props.text;
  state.text = ['a'];
  state.settled = [];
  state.isScrambling = false;
  $text.value = '';
});

useIntervalFn(function interval() {
  state.update();
  $text.value = state.text.join('​');
}, 50);


</script>

<template>
  <span>{{ $text }}</span>
</template>

<style scoped>

</style>
