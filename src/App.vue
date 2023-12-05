<script setup>
import {computed, provide, ref, watchEffect} from "vue";
import {useInterval, useLocalStorage} from "@vueuse/core";
import CardBase from "./components/CardBase.vue";
import V1Shine from "./components/V1Shine.vue";
import V1Sparkle from "./components/V1Sparkle.vue";
import GlareV2 from "./components/V2Glare.vue";
import GlareV3 from "./components/V3Glare.vue";
import ShineRainbow from "./components/V3RainbowShine.vue";
import MatrixRunes from "./components/MatrixRunes.vue";
import Foil from "./components/Foil.vue";
import GlareReverseHolo from "./components/GlareReverseHolo.vue";
import DevWorldTicket from "./components/DevWorldTicket.vue";
import DevWorldNeon from "./components/DevWorldNeon.vue";
import DevWorldBadges from "./components/DevWorldBadges.vue";
import DevWorldStandaloneBadge from "./components/DevWorldStandaloneBadge.vue";
import DevWorldReglBadge from "./components/DevWorldReglBadge.vue";

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

const $app = ref(null);
watchEffect(() => {
  if ($app.value) {
    applyTilt($app.value, tilt.value);
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
  <main id="app" ref="$app">
    <h1 id="settings"><a href="#settings">Settings</a></h1>
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
            {{ face.label }}
          </option>
        </select>
      </fieldset>
    </form>
    <h1 id="samples"><a href="#samples">Samples</a></h1>
    <div class="cardlist">
      <div class="cardcase">
        <DevWorldStandaloneBadge />
      </div>
      <div class="cardcase">
        <DevWorldReglBadge />
      </div>
    </div>
    <div style="min-height:100vh"></div>
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

  & > h2 {
    text-align: center;
    margin: 0;
    order: 1; /* Place after the card */
  }
}
</style>
<style scoped>
h1 {
  text-align: center;
  border-top: 2px dotted currentColor;

  & a {
    color: inherit;
    text-decoration: none;
  }
}

img {
  width: 100%;
  height: auto;
}

.pokemon-card {
  /* Clip the corners, otherwise the glare extends over the rounded corners. */
  border-radius: 4.55% / 3.5%;
  overflow: hidden;
}

>>> .devworld-ticket {
  border-radius: 50px;
  overflow: hidden;
}
</style>
