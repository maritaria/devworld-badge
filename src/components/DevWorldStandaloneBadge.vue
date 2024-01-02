<script setup>

import MatrixShine from "./MatrixShine.vue";
import CardBase from "./CardBase.vue";
import Foil from "./Foil.vue";
import foilUrl from '../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg';
import {ref, watchEffect} from "vue";
import ScrambledName from "./ScrambledName.vue";

defineProps({
  color: {default: 'blue'},
});

const name = ref('Bram Kamies');
const picture = ref(null);
const pictureHref = ref('');

watchEffect((cleanup) => {
  if (!picture.value) return;
  const href = URL.createObjectURL(picture.value);
  pictureHref.value = href;
  cleanup(() => URL.revokeObjectURL(href));
});

/** @param {InputEvent} event */
function onPicture(event) {
  picture.value = event.target.files[0];
}

</script>

<template>
  <CardBase>
    <div class="dev-world" :class="color">
      <img src="../assets/doc/niki-devworld-badge-sample-3.jpg">
      <div class="inset extra"></div>
      <Foil :foil="foilUrl" />
      <MatrixShine />
    </div>
    <div class="info-layer">
      <div class="avatar">
        <img v-if="pictureHref" :src="pictureHref">
      </div>
      <ScrambledName :text="name" class="name" />
    </div>
  </CardBase>
  <form>
    <label>
      Your name:
      <input name="name" v-model="name">
    </label>
    <label>
      Picture:
      <input type="file" accept="image/*" name="picture" @change="onPicture">
    </label>
  </form>
</template>

<style scoped>

.info-layer {
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
}

.name {
  max-width: 100%;
  text-align: center;
  font-size: 40px;
  font-family: monospace;
  color: white;
  text-shadow: cyan 0 0 5px, skyblue 0 0 10px, deepskyblue 0 0 5px;
}

.avatar {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 20px;
  overflow: hidden;
}

label {
  display: block;
}

img {
  border: none;
}

.dev-world {
  width: 400px; /* height: 563.8 */

  display: grid;

  //box-shadow: var(--border-glow-outside) 0 0 20px 3px, var(--border-glow-outside-extra) 0 0 2px 3px;
  overflow: hidden;
  border-radius: 7.5% / 5.32%;

  & > * {
    grid-area: 1/1;
  }

  & .inset {
    box-shadow: var(--border-glow-inside) 0 0 20px 10px inset;
    border-radius: inherit;
  }

  & img {
    width: 100%;
  }
}

.dev-world.lightgreen {
  --border-glow-outside: lime;
  --border-glow-outside-extra: white;
  --border-glow-inside: lightgreen;
}

.dev-world.lawngreen {
  --border-glow-outside: lime;
  --border-glow-outside-extra: white;
  --border-glow-inside: lawngreen;
}

.dev-world.purple {
  --border-glow-outside: darkviolet;
  --border-glow-outside-extra: violet;
  --border-glow-inside: darkviolet;
}

.dev-world.blue {
  --border-glow-outside: aqua;
  --border-glow-outside-extra: white;
  --border-glow-inside: deepskyblue;
}

.dev-world.red {
  --border-glow-outside: red;
  --border-glow-outside-extra: white;
  --border-glow-inside: red;
}

.dev-world.yellow {
  --border-glow-outside: yellow;
  --border-glow-outside-extra: white;
  --border-glow-inside: yellow;
}

</style>
