<script setup>
import CardBase from "./cards/CardBase.vue";
import CardV1 from "./cards/CardV1.vue";
import CardV2 from "./cards/CardV2.vue";
import CardV3RainbowShine from "./cards/CardV3RainbowShine.vue";
import MatrixCard from "./cards/MatrixCard.vue";
</script>

<template>
  <main id="app">
    <h1>Cards</h1>
    <div class="cardlist">
      <div class="cardcase">
        <h2>Base card</h2>
        <CardBase />
      </div>
      <div class="cardcase">
        <h2>V1: Cyan+Magenta</h2>
        <CardV1 />
      </div>
      <div class="cardcase">
        <h2>V2: Basic glare</h2>
        <CardV2 />
      </div>
      <div class="cardcase">
        <h2>V3: Rainbow Shine</h2>
        <CardV3RainbowShine />
      </div>
      <div class="cardcase">
        <h2>Matrix</h2>
        <MatrixCard />
      </div>
    </div>
  </main>
</template>

<style>
.cardlist {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;

  & > * {flex: 0 0 300px;}
}

.cardcase {
  /* Border and spacing */
  border: 3px solid dimgray;
  border-radius: 30px;
  padding: 10px;
  /* Vertical stack the children */
  display: flex;
  flex-direction: column;
  gap: 10px;

  & h2 {
    text-align: center;
    margin: 0;
    order: 1; /* Place after the card */
  }
}
</style>
