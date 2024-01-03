<script setup>
const model = defineModel();
defineProps({
  label: String,
  min: Number,
  max: Number,
  step: Number,
});
</script>

<template>
  <label>
    <span>{{label}}: {{model}}</span>
    <input
        type="range"
        v-bind="{min, max, step}" v-model="model" />
  </label>
</template>

<style scoped>
label {
  display: flex;
  align-items: center;
  & span {
    display: inline-block;
    width: 80px;
    font-family: monospace;
  }
  & input {
    flex-grow: 1;
  }
}
</style>
