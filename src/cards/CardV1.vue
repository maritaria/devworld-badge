<script setup>
import CardBase from "./CardBase.vue";
</script>

<template>
  <CardBase>
    <img src="https://images.pokemontcg.io/sm10/33_hires.png">
    <div class="card-glare"></div>
    <div class="card-sparkle"></div>
  </CardBase>
</template>

<style scoped>
.card-glare {
  --color1: #00ffff;
  --color2: #ff00ff;
  background-image: linear-gradient(
      120deg,
      transparent 25%,
      #00ffff 48%,
      #ff00ff 52%,
      transparent 75%
  );
  /*background-image: linear-gradient(115deg, transparent 0%, var(--color1) 25%, transparent 47%, transparent 53%, var(--color2) 75%, transparent 100%);*/
  background-position-x: calc(100% - var(--pointer-x));
  background-position-y: calc(100% - var(--pointer-y));
  background-size: 250% 250%;
  mix-blend-mode: color-dodge;
  opacity: calc(0.8 * var(--glare-opacity));
  filter: brightness(0.5) contrast(1);
}

.card-sparkle {
  background-image: url("https://assets.codepen.io/13471/sparkles.gif"),
  url(https://assets.codepen.io/13471/holo.png),
  linear-gradient(125deg,
      #ff008450 15%,
      #fca40040 30%,
      #ffff0030 40%,
      #00ff8a20 60%,
      #00cfff40 70%,
      #cc4cfa50 85%
  );
  background-position: 50% 50%;
  background-size: 160%;
  background-blend-mode: overlay;
  z-index: 2;
  filter: brightness(1) contrast(1);
  /*transition: all 0.33s ease;*/
  mix-blend-mode: color-dodge;
  opacity: calc(0.3 + 0.25 * var(--glare-opacity));
  /*background-position-x: calc(100% - var(--pointer-x));
  background-position-y: calc(100% - var(--pointer-y));*/
}
</style>
