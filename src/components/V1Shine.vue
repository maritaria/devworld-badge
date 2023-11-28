<template>
  <div class="card-shine"></div>
</template>

<style scoped>
.card-shine {
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
</style>
