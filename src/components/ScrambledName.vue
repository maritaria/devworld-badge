<script setup>
import {reactive, ref, watch, watchEffect} from "vue";
import {useIntervalFn} from "@vueuse/core";
import {ScrambledText} from "../scrambled-text.js";
import {useScrambledText} from "../vue/use-scrambled-text.js";

const props = defineProps({
  text: {default: ''},
});

const $text = useScrambledText(() => props.text).text;

</script>

<template>
  <span>{{ $text }}</span>
</template>

<style scoped>

</style>
