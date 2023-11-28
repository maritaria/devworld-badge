<template>
  <div class="card-glare"></div>
</template>

<style scoped>
.card-glare {
  background: radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsla(0, 0%, 100%, 0.8) 10%,
      hsla(0, 0%, 100%, 0.65) 20%,
      hsla(0, 0%, 0%, 0.5) 90%
  );
  mix-blend-mode: overlay;
  opacity: var(--glare-opacity);
}
</style>
