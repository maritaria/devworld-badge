<script setup>
defineProps({
  color: {type: String, required: true},
  dark: {type: Boolean},
});
</script>
<template>
  <span :style="{color}" :class="{dark}" />
</template>
<style scoped>
span {
  background: currentColor;
  border: 1px solid black;
  display: inline-block;
  aspect-ratio: 1/ 1;
  width: 0.7em;
  vertical-align: baseline;
}

span.dark {
  border-color: white;
}
</style>
