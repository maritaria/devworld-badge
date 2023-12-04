<script setup>
import {reactive, ref, watch} from "vue";
import {useIntervalFn} from "@vueuse/core";

const props = defineProps({
  text: {default: ''},
});

const state = reactive({
  target: '',
  text: [],
  settled: [],
  settleChance: 0.6,
  scrambleChance: 0.04,
  isScrambling: false,
});

// 1. Growing / Shrinking
// 2. Settling

function init() {
  state.target = props.text;
  state.text = ['a'];
  state.settled = [];
  state.isScrambling = false;
}

watch(() => props.text, init, {immediate: true});

function isSettled(state) {
  return state.settled.length >= state.target.length;
}

function settle(state) {
  const remaining = state.target.length - state.settled.length;
  let index = Math.floor(Math.random() * remaining);
  while (state.settled.includes(index)) {
    index++;
  }
  state.settled.push(index);
  state.settled.sort((a, b) => a - b);
}

function scramble(state) {
  for (let index = 0; index < state.text.length; index++) {
    const isSettled = state.settled.includes(index);
    state.text[index] = isSettled ? state.target[index] : (letter() + '​');
  }
}

const alphabets = [
  'abcdefghijklmnopqrstuvwxyz',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '0123456789',
  '!@#$%^&*_+-=;:|<>,.?§~',
];

function letter() {
  const alphabet = pick(alphabets);
  return pick(alphabet);

  function pick(set) {
    return set[Math.floor(Math.random() * set.length)];
  }
}

function needsResize(state) {
  return state.text.length !== state.target.length;
}

useIntervalFn(function interval() {
  scramble(state);
  if (state.isScrambling) {
    if (Math.random() < state.settleChance) {
      if (state.text.length <= 1) {
        state.isScrambling = false;
      } else if (state.settled.length) {
        state.settled.splice(Math.floor(Math.random() * state.settled.length), 1);
      } else {
        state.text.splice(0, 1);
      }
    }
  } else if (needsResize(state)) {
    resize(state);
  } else if (isSettled(state)) {
    if (Math.random() < state.scrambleChance) {
      state.isScrambling = true;
    }
  } else if (Math.random() < state.settleChance) {
    settle(state);
  }
}, 50);

function resize(state) {
  if (Math.random() < state.settleChance) {
    if (state.text.length < state.target.length) {
      state.text.push('');
    } else {
      state.text.splice(0, 1);
    }
  }
}

</script>

<template>
  <span>{{ state.text.join('') }}</span>
</template>

<style scoped>

</style>
