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
import ReglBadge from "./components/ReglBadge.vue";
import ReglFoil from "./components/ReglFoil.vue";
import LinearGradientLineExperiment from "./components/LinearGradientLineExperiment.vue";
import ReglBoxShadow from "./components/ReglBoxShadow.vue";
import ReglLayeringTest from "./components/ReglLayeringTest.vue";
import ReglTiltedPanel from "./components/ReglTiltedPanel.vue";
import ReglCube from "./components/ReglCube.vue";
import ReglRecorder from "./components/ReglRecorder.vue";
import SpringGraph from "./components/SpringGraph.vue";
import ReglTiltedCard from "./components/ReglTiltedCard.vue";
import ReglNeonText from "./components/ReglNeonText.vue";
import ReglMatrixRain from "./components/ReglMatrixRain.vue";
import ReglPlusLighter from "./components/ReglPlusLighter.vue";
import ReglAvatar from "./components/ReglAvatar.vue";
import SilhouettePicker from "./components/AvatarPicker.vue";
import ReglPersonalCard from "./components/ReglPersonalCard.vue";
import CanvasTextRenderer from "./components/CanvasTextRenderer.vue";
import NavigationMenu from "./components/NavigationMenu.vue";

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

watchEffect(() => {
  applyTilt(window.app, tilt.value);
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
  <NavigationMenu />
  <router-view />
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

summary {
  display: block;
}

</style>
