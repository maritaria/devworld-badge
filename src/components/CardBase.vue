<script setup>
import {onMounted, ref} from "vue";

defineProps(['wrap-class']);


const $el = ref(null);

onMounted(() => {
  setupTiltByMouse($el.value);
});
</script>

<template>
  <div class="card-base" ref="$el">
    <div class="card-content" :class="wrapClass">
      <slot></slot>
    </div>
  </div>
</template>

<style>
:root {
  --pointer-x: 50%;
  --pointer-y: 50%;
  --pointer-from-center: 0;
  --pointer-from-left: .5;
  --pointer-from-top: .5;
  --rotate-x: 0deg;
  --rotate-y: 0deg;
  --glare-opacity: 0;
  --background-x: 50%;
  --background-y: 50%;
}
</style>

<style scoped>
.card-base {
  /* Start 3D rendering stack */
  perspective: 600px;

  .card-content {
    transform: rotateY(var(--rotate-x)) rotateX(var(--rotate-y));
    transform-style: preserve-3d;
    transform-origin: center;

    /* Treat immediate children of card-content as layers */
    display: grid;
    & >>> > * { grid-area: 1/1; }
  }
}
</style>
