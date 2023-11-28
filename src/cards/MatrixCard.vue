<script setup>
import CardBase from "./CardBase.vue";
import {onMounted, ref} from "vue";

const numCols = 10;
const numRows = 12;
const alphabet = false
    ? ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ']
    : ['0', '1'];
const randomRune = () => alphabet[Math.floor(Math.random() * alphabet.length)];

const $el = ref(null);
onMounted(() => {
  setupRunes($el.value);
});

/** @param {HTMLElement} container */
function setupRunes(container) {
  for (let x = 0; x < numCols; x++) {
    const column = document.createElement('span');
    column.classList.add('rune-col');
    for (let y = 0; y < numRows; y++) {
      const cell = document.createElement('span');
      cell.innerText = randomRune();
      cell.classList.add('rune');
      if (Math.random() > 0.5) {
        cell.classList.add('fresh');
      }
      column.appendChild(cell);
    }
    container.appendChild(column);
  }

  setInterval(function changeRunes() {
    container.querySelectorAll('.rune.fresh').forEach(element => element.classList.remove('fresh'));
    const total = numCols * numRows;
    for (let i = 0; i < total / 3; i++) {
      const randomIndex = Math.floor(Math.random() * total);
      const row = Math.floor(randomIndex / numCols);
      const col = randomIndex % numCols;
      const cell = container.children.item(col).children.item(row);
      cell.innerText = randomRune();
      cell.classList.add('fresh');
    }
  }, 1_000);
}
</script>

<template>
  <CardBase>
    <img src="https://images.pokemontcg.io/sm10/33_hires.png">
    <div class="card-runes" ref="$el"></div>
  </CardBase>
</template>
<style scoped>
.card-runes {
  font-family: monospace;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  mix-blend-mode: color-dodge;
  opacity: var(--glare-opacity);

  mask-image: radial-gradient(
      farthest-corner circle at var(--pointer-x) var(--pointer-y),
      hsla(0, 0%, 100%, 1) 10%,
      hsla(0, 0%, 100%, 0.8) 40%,
      hsla(0, 0%, 0%, 0) 90%
  );

  & >>> .rune-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  & >>> .rune {
    color: transparent;
    text-shadow: rgba(0, 0, 0, 0.1) 0 0 3px;
    transition: all 1s ease-in-out;
    flex-grow: 1;
    flex-basis: 0;
  }

  & >>> .rune.fresh {
    text-shadow: green 0 0 5px, lightgreen 0 0 10px, lightgreen 0 0 10px, lightgreen 0 0 10px;
    color: white;
  }
}
</style>
