<script setup>
import CardBase from "./CardBase.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {useIntervalFn} from "@vueuse/core";

const numCols = 10;
const numRows = 12;
const alphabet = false
    ? ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ']
    : ['0', '1'];
const runeText = () => alphabet[Math.floor(Math.random() * alphabet.length)];
const arr = (length, fn) => Array.from({length}, (_, i) => fn(i));

/** @type {{text:string, fresh:boolean}[][]} */
const grid = reactive(
    arr(numCols, x =>
        arr(numRows, y =>
            ({
              text: runeText(),
              fresh: Math.random() > 0.5,
            })
        )
    )
);

useIntervalFn(() => {
  const total = numCols * numRows;
  // Try to turn some back on
  change(.5 * total, cell => {
    if (!cell.fresh) {
      cell.fresh = true;
      cell.text = runeText();
    }
  });
  // Disable half the cells
  change(total * 0.5, cell => cell.fresh = false);

  function change(amount, fn) {
    for (let i = 0; i < amount; i++) {
      const index = Math.floor(Math.random() * total);
      const row = Math.floor(index / numCols);
      const col = index % numCols;
      const cell = grid[col][row];
      fn(cell, col, row);
    }
  }
}, 1000);
</script>

<template>
  <CardBase>
    <img src="https://images.pokemontcg.io/sm10/33_hires.png">
    <div class="card-runes" ref="$el">
      <span v-for="(col, x) in grid" class="rune-col">
        <span v-for="cell in col" class="rune" :class="{fresh:cell.fresh}">
          {{ cell.text }}
        </span>
      </span>
    </div>
    <div class="card-glare"></div>
  </CardBase>
</template>
<style scoped>
.card-runes {
  font-family: monospace;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  mix-blend-mode: plus-lighter;
  opacity: var(--glare-opacity);

  mask-image: radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      #ffffffff 10%,
      #ffffffcc 40%,
      #ffffff00 90%
  );

  & .rune-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  & .rune {
    color: transparent;
    text-shadow: rgba(0, 0, 0, 0.1) 0 0 3px;
    transition: all 1s ease-in-out;
    flex-grow: 1;
    flex-basis: 0;

    &.fresh {
      text-shadow: lightgreen 0 0 5px, lightgreen 0 0 10px;
      color: white;
    }
  }
}

.card-glare {
  background: radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsla(0, 0%, 100%, 0.8) 10%,
      hsla(0, 0%, 100%, 0.65) 20%,
      hsla(0, 0%, 0%, 0.5) 90%
  );
  mix-blend-mode: overlay;
  opacity: var(--glare-opacity);
}
</style>
