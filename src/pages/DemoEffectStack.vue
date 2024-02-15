<script setup>

import badgeUrl from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import foilUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";
import CardBase from "../components/CardBase.vue";
import Foil from "../components/Foil.vue";
import { reactive } from "vue";

const $classes = reactive({
  'layer-1': false,
  'layer-2': false,
  'layer-3': false,
  'opacity': false,
  'filter': false,
  'blend': false,
})
</script>

<template>
  <div class="cardlist">
    <div class="cardcase">
      <h2>Base</h2>
      <CardBase>
        <div class="dev-world">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" class="debug" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Layer 1</h2>
      <CardBase>
        <div class="dev-world lightgreen">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" class="debug layer-1" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Layer 2</h2>
      <CardBase>
        <div class="dev-world lightgreen">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" class="debug layer-2" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Layer 3</h2>
      <CardBase>
        <div class="dev-world lightgreen">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" class="debug layer-3" />
        </div>
      </CardBase>
    </div>
  </div>
  <div class="demo-container">
    <div class="demo-card">
      <CardBase style="max-width:100%">
        <div class="dev-world lightgreen">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" class="debug" :class="$classes" />
        </div>
      </CardBase>
    </div>
    <div class="demo-form">
      <h2 style="order: unset">Debug mode</h2>
      <label>
        <input type="checkbox" v-model="$classes['layer-1']">Layer 1</label>
      <label>
        <input type="checkbox" v-model="$classes['layer-2']">Layer 2</label>
      <label>
        <input type="checkbox" v-model="$classes['layer-3']">Layer 3</label>
      <label>
        <input type="checkbox" v-model="$classes['filter']">
        <code>filter: brightness(0.6) contrast(1.5) saturate(1)</code>
      </label>
      <label>
        <input type="checkbox" v-model="$classes['opacity']">Opacity</label>
      <label>
        <input type="checkbox" v-model="$classes['blend']">
        <code>mix-blend-mode:color-dodge</code>
      </label>
      <pre>{{ JSON.stringify($classes, null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>

.demo-container {
  display: flex;
  margin: 200px auto;
  max-width: 800px;
  gap: 50px;
}
.demo-card {
  max-width: 400px;
}
.demo-form {
  width: 500px;
}

label {
  display: block;
}

.cardlist {
  margin-top: 30px;
  margin-bottom: 60px;
}

.dev-world {

  display: grid;

  box-shadow: var(--border-glow-outside) 0 0 20px 3px, var(--border-glow-outside-extra) 0 0 2px 3px;
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

</style>
