<script setup>

</script>

<template>
  <div class="dev-world">
    <svg style="fill:transparent; stroke:white;stroke-width: 2">
      <circle cx="20" cy="20" r="5"></circle>
      <path d="M 20 20 m 5 0 h 350 l 40 40 v 40" stroke-width="2"></path>
      <circle :cx="20+350+40+5" :cy="20+40+40+5" r="5"></circle>

      <circle cx="20" cy="40" r="5"></circle>
      <path d="M 20 40 m 5 0 h 340 l 30 30 v 30"></path>
      <circle :cx="20+340+30+5" :cy="40+30+30+5" r="5"></circle>
    </svg>
  </div>
</template>

<style scoped>
.dev-world {
  aspect-ratio: 16 / 9;
  min-width: 400px;
  background: red;

  /* Based on doc/linkedin-circuit-poster.png */
  background:
  linear-gradient(
      120deg,
      darkblue 0%,
      purple 40%,
      darkorange 90%
  );
  background-blend-mode: soft-light;

  display: grid;
}
svg {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
}
</style>
