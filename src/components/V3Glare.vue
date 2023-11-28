<template>
  <div class="card-glare"></div>
</template>

<style scoped>
.card-glare {
  background-image: radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsl(0, 0%, 100%) 0%,
      hsla(210, 3%, 54%, 0.33) 45%,
      hsla(0, 0%, 20%, 0.9) 130%
  );
  mix-blend-mode: hard-light;
  opacity: calc(var(--glare-opacity) * 0.5);
  filter: brightness(.9) contrast(1.75);
  transform: translateZ(1.41px);
}
</style>
