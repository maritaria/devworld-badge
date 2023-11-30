<script setup>
import Foil from "./Foil.vue";
</script>

<template>
  <div class="dev-world">
    <img src="../assets/doc/niki-devworld-badge-sample-3.jpg">
    <div class="inset"></div>
    <Foil foil="../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg" />
  </div>
</template>

<style scoped>
.dev-world {
  min-width: 400px;

  display: grid;

  box-shadow: lime 0 0 20px 3px, white 0 0 2px 3px;
  overflow: hidden;
  border-radius: 30px;

  & > * {
    grid-area: 1/1;
  }

  .inset {
    box-shadow: green 0 0 20px 10px inset;
    border-radius: inherit;
  }

  img {
    max-width: 100%;

  }
}

</style>
