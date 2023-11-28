<script setup>
import {computed, provide, ref, watchEffect} from "vue";
import {useInterval, useLocalStorage} from "@vueuse/core";
import CardBase from "./components/CardBase.vue";
import V1Shine from "./components/V1Shine.vue";
import V1Sparkle from "./components/V1Sparkle.vue";
import GlareV2 from "./components/V2Glare.vue";
import GlareV3 from "./components/V3Glare.vue";
import ShineRainbow from "./components/V3RainbowShine.vue";
import MatrixLayer from "./components/MatrixRunes.vue";

const autoPointer = useLocalStorage('cards.autoPointer', 'disabled');

const now = useInterval(20);
const tilt = computed(() => {
  switch (autoPointer.value) {
    case 'static':
      return {x: 70, y: 30};
    case 'circle': {
      const r = now.value * 20 / 1000;
      const x = 50 + Math.cos(r) * 25;
      const y = 50 + Math.sin(r) * 25;
      return {
        x, y
      };
    }
  }
  return null;
});

const $list = ref(null);
watchEffect(() => {
  if ($list.value) {
    applyTilt($list.value, tilt.value);
  }
});

</script>

<template>
  <main id="app">
    <h1>Cards</h1>
    <form style="margin-bottom:30px" id="settings">
      <fieldset name="pointerLogicGroup">
        <legend>Tilt all cards</legend>
        <label>
          <input type="radio" name="autoPointer" value="disabled" v-model="autoPointer">
          Tilt on hover
        </label>
        <label>
          <input type="radio" name="autoPointer" value="static" v-model="autoPointer">
          Tilt with fixed position
        </label>
        <label>
          <input type="radio" name="autoPointer" value="circle" v-model="autoPointer">
          Tilt with circle pattern
        </label>
      </fieldset>
    </form>
    <div class="cardlist" ref="$list">
      <div class="cardcase">
        <h2>Base card</h2>
        <CardBase>
          <img src="https://images.pokemontcg.io/sm10/33_hires.png">
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>V1: Cyan+Magenta</h2>
        <CardBase>
          <img src="https://images.pokemontcg.io/sm10/33_hires.png">
          <V1Shine />
          <V1Sparkle />
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>V2: Basic glare</h2>
        <CardBase>
          <img src="https://images.pokemontcg.io/sm10/33_hires.png">
          <GlareV2 />
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>V3: Rainbow Shine</h2>
        <CardBase>
          <img src="https://images.pokemontcg.io/sm10/33_hires.png">
          <ShineRainbow />
          <GlareV3 />
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>Matrix</h2>
        <CardBase>
          <img src="https://images.pokemontcg.io/sm10/33_hires.png">
          <MatrixLayer />
          <GlareV2 />
        </CardBase>
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
