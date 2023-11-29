<template>
  <div class="card-glare"></div>
</template>

<style scoped>
.card-glare {
  /* Basic glare */
  transform: translateZ(1.41px);
  overflow: hidden;
  mix-blend-mode: overlay;

  /* Reverse holo */
  opacity: var(--glare-opacity);
  background-image: radial-gradient( farthest-corner circle at var(--pointer-x) var(--pointer-y), hsla(0, 0%, 100%, 0.8) 10%, hsla(0, 0%, 100%, 0.5) 20%, hsla(0, 0%, 0%, 0.75) 90% );
  filter: brightness(.7) contrast(1.5);

  &::after {
    content: "";
    opacity: var(--card-opacity);
    background-image: radial-gradient( farthest-corner circle at var(--pointer-x) var(--pointer-y), hsl(0, 0%, 100%) 10%, hsla(0, 0%, 100%, 0.5) 20%, hsla(0, 0%, 0%, 0.5) 120% );
    filter: brightness(1) contrast(1.5);

    --clip: inset( 9.85% 8% 52.85% 8% );
    clip-path: var(--clip);
  }
}
</style>
