<script setup>
import CardBase from "./components/CardBase.vue";
import CardV1 from "./components/CardV1.vue";
import CardV2 from "./components/CardV2.vue";
import CardV3RainbowShine from "./components/CardV3RainbowShine.vue";
import MatrixCard from "./components/MatrixCard.vue";
import {provide, ref} from "vue";
import {useLocalStorage} from "@vueuse/core";

const autoPointer = useLocalStorage('cards.autoPointer', false);

provide('autoPointer', autoPointer);


</script>

<template>
  <main id="app">
    <h1>Cards</h1>
    <form>
      <label><input type="checkbox" v-model="autoPointer">Auto pointer {{autoPointer}}</label>
    </form>
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
      <!-- Horizontal stripe holo -->
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
