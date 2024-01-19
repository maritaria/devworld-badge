<script setup>
import CardBase from "./CardBase.vue";
import Foil from "./Foil.vue";
import MatrixRunes from "./MatrixRunes.vue";
import MatrixShine from "./MatrixShine.vue";
import badgeUrl from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import foilUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";

</script>

<template>
  <div class="cardlist">
    <div class="cardcase">
      <h2>Default</h2>
      <CardBase>
        <div class="dev-world">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Lightgreen</h2>
      <CardBase>
        <div class="dev-world lightgreen">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Lawngreen</h2>
      <CardBase>
        <div class="dev-world lawngreen">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Red</h2>
      <CardBase>
        <div class="dev-world red">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Blue</h2>
      <CardBase>
        <div class="dev-world blue">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Yellow</h2>
      <CardBase>
        <div class="dev-world yellow">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>Purple</h2>
      <CardBase>
        <div class="dev-world purple">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>MatrixRunes</h2>
      <CardBase>
        <div class="dev-world blue">
          <img :src="badgeUrl">
          <div class="inset"></div>
          <Foil :foil="foilUrl" />
          <MatrixRunes />
        </div>
      </CardBase>
    </div>
    <div class="cardcase">
      <h2>MatrixShine</h2>
      <CardBase>
        <div class="dev-world blue">
          <img :src="badgeUrl">
          <div class="inset extra" ref="$inset"></div>
          <Foil :foil="foilUrl" />
          <MatrixShine />
        </div>
      </CardBase>
    </div>
  </div>
</template>

<style scoped>
.dev-world {
  width: 400px; /* height: 563.8 */

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
