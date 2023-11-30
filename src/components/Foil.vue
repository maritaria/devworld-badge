<script setup>
import {computed} from "vue";

const props = defineProps(['foil', 'mask']);

const foilUrl = computed(() => props.foil ? `url(${props.foil})` : undefined);
const maskUrl = computed(() => props.mask ? `url(${props.mask})` : undefined);

</script>

<template>
  <div class="foil"></div>
</template>

<style scoped>
.foil {
  --mask: v-bind(maskUrl);
  --foil: v-bind(foilUrl);

  --foil-brightness: 0.6; /* .card.metal */
  --card-opacity: var(--glare-opacity);

  background-image: radial-gradient(
      circle at var(--pointer-x) var(--pointer-y),
      #fff 5%,
      #000 50%,
      #fff 80%
  ),
  linear-gradient(
      -45deg,
      #000 15%,
      #fff,
      #000 85%
  ), var(--foil);
  background-blend-mode: soft-light, difference;
  background-size: 120% 120%, 200% 200%, cover;
  background-position: center center,
  var(--pointer-x) var(--pointer-y),
  center center;
  filter: brightness(var(--foil-brightness)) contrast(1.5) saturate(1);
  mix-blend-mode: color-dodge;
  opacity: calc((1.5 * var(--card-opacity)) - var(--pointer-from-center));

  /* Mask */
  mask-image: var(--mask);
  mask-size: cover;
  mask-position: center center;

  /* .card__shine */
  transform: translateZ(1px);

  /* .card__rotator * */
  image-rendering: optimizeQuality;
  transform-style: preserve-3d;

}

</style>
