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
import Foil from "./components/Foil.vue";
import GlareReverseHolo from "./components/GlareReverseHolo.vue";

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

const faces = [
  {label: 'Squirtle', url: 'https://images.pokemontcg.io/sm10/33_hires.png'},
  {label: 'Charmander', url: 'https://images.pokemontcg.io/sm115/7_hires.png'},
  {label: 'Bulbasaur', url: 'https://images.pokemontcg.io/sm35/1_hires.png'},
];

const selectedFace = useLocalStorage('cards.face', faces[0].url);
provide('cards.face', selectedFace);

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
      <fieldset>
        <legend>Card face</legend>
        <select v-model="selectedFace">
          <option v-for="face in faces" :value="face.url">
            {{face.label}}
          </option>
        </select>
      </fieldset>
    </form>
    <div class="cardlist" ref="$list">
      <div class="cardcase">
        <h2>Base card</h2>
        <CardBase>
          <img :src="selectedFace">
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>V1: Cyan+Magenta</h2>
        <CardBase>
          <img :src="selectedFace">
          <V1Shine />
          <V1Sparkle />
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>V2: Basic glare</h2>
        <CardBase>
          <img :src="selectedFace">
          <GlareV2 />
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>V3: Rainbow Shine</h2>
        <CardBase>
          <img :src="selectedFace">
          <ShineRainbow />
          <GlareV3 />
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>Matrix</h2>
        <CardBase>
          <img :src="selectedFace">
          <MatrixLayer />
          <GlareV2 />
        </CardBase>
      </div>
      <div class="cardcase">
        <h2>Foil</h2>
        <CardBase>
          <img :src="selectedFace">
          <Foil />
          <GlareReverseHolo />
        </CardBase>
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
