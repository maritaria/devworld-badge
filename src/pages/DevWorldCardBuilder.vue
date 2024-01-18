<script setup>
import {computed, ref} from "vue";
import PersonalCard from "../components/PersonalCard.vue";
import {watchLog} from "../vue/development.js";
import {htmlToDataUrl} from "../resources.js";
import foilUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";
import TexturePicker from "../components/TexturePicker.vue";
import AvatarPicker from "../components/AvatarPicker.vue";
import {colorToHex, rgbaToHex} from "../colors.js";

const $title = ref('');
const $subtitle = ref('');
const $background = ref(null);
const $foil = ref(foilUrl);
const $avatar = ref(null);
const $glow = ref('deepskyblue');

const glowPresets = [
  'black',
  'white',
  'deepskyblue',
  'green',
  'red',
  'lime',
  'lawngreen',
  'darkviolet',
  'violet',
  'aqua',
  'yellow',
];

watchLog('$glow', $glow);

</script>
<template>
  <div class="card-builder">
    <form>
      <fieldset>
        <legend>Glow</legend>
        <label>
          Color:
          <input type="color" v-model="$glow">
        </label>
        <button v-for="preset in glowPresets" :key="preset" type="button" @click.prevent="$glow = colorToHex(preset)">
          <span style="text-shadow: 0 0px 1px black" :style="`color:${preset}`">■</span> <code>{{ preset }}</code>
        </button>
      </fieldset>
      <fieldset>
        <legend>Texts</legend>
        <label>
          Title: <input v-model="$title" placeholder="Your name here">
        </label>
        <label>
          Subtitle: <input v-model="$subtitle" placeholder="Job title, country, or similar">
        </label>
        <label>
          Color: <input type="color" v-model="$textColor">
        </label>
      </fieldset>
      <fieldset>
        <legend>Avatar</legend>
        <AvatarPicker v-model="$avatar" />
      </fieldset>
      <TexturePicker legend="Background" fieldname="background" v-model="$background" />
      <TexturePicker legend="Foil" fieldname="foil" v-model="$foil" />
    </form>
    <div class="card-canvas">
      <PersonalCard
          :background="$background"
          :foil="$foil"
          :avatar="$avatar"
          :title="$title"
          :subtitle="$subtitle"
          :glow="$glow"
      />
    </div>
  </div>
</template>
<style scoped>
label {
  display: block;
}

.card-builder {
  display: flex;
  flex-direction: row;
}

.card-canvas {
  flex-grow: 0;
  flex-shrink: 0;
  min-width: 600px;
}

canvas {
  /*object-fit: contain;*/
}


</style>
