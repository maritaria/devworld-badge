<script setup>

</script>

<template>
  <div class="dev-world">
    <img src="../assets/doc/linkedin-circuit-poster.png">
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
