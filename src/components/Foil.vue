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
  --layer-1: var(--foil);
  --layer-2: linear-gradient(
      -45deg,
      #000 15%,
      #fff 50%,
      #000 85%
  );
  --layer-3: radial-gradient(
      circle at var(--pointer-x) var(--pointer-y),
      #fff 5%,
      #000 50%,
      #fff 80%
  );
}

.foil.debug:not(.layer-1) {--layer-1: none;}
.foil.debug:not(.layer-2) {--layer-2: none;}
.foil.debug:not(.layer-3) {--layer-3: none;}
.foil.debug:not(.filter) { filter: unset; }
.foil.debug:not(.blend) {mix-blend-mode: unset;}
.foil.debug:not(.opacity) {opacity: unset;}

.foil {
  --mask: v-bind(maskUrl);
  --foil: v-bind(foilUrl);

  --card-opacity: var(--glare-opacity);

  background-image: var(--layer-3), var(--layer-2), var(--layer-1);
  background-blend-mode: soft-light, difference;
  background-size: 120% 120%, 200% 200%, cover;
  background-position: center center, var(--pointer-x) var(--pointer-y), center center;
  filter: brightness(0.6) contrast(1.5) saturate(1);
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
