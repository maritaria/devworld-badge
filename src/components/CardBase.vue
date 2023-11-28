<script setup>
import {onMounted, ref} from "vue";

const $el = ref(null);

onMounted(() => {
  setupTiltByMouse($el.value);
});
</script>

<template>
  <div class="card-base" js-tilt ref="$el">
    <div class="card-content">
      <slot>
        <img src="https://images.pokemontcg.io/sm10/33_hires.png">
      </slot>
    </div>
  </div>
</template>

<style>
:root {
  --pointer-x: 50%;
  --pointer-y: 50%;
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
  /* Defaults for animated / interactive display */


  .card-content {
    transform: rotateY(var(--rotate-x)) rotateX(var(--rotate-y));
    transform-style: preserve-3d;
    transform-origin: center;

    /* Clip the corners, otherwise the glare extends over the rounded corners. */
    border-radius: 4.55% / 3.5%;
    overflow: hidden;

    /* Size the backing image to the card container */
    & >>> > img { width: 100%; }

    /* Treat immediate children of card-content as layers */
    display: grid;
    & >>> > * { grid-area: 1/1; }
  }
}
</style>
