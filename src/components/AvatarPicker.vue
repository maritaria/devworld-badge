<script setup>
import silhouette_1 from '../assets/silhouette_1.jpeg';
import silhouette_2 from "../assets/silhouette_2.jpeg"
import silhouette_4 from "../assets/silhouette_4.jpeg"
import silhouette_6 from "../assets/silhouette_6.jpeg"
import silhouette_7 from "../assets/silhouette_7.webp"
import silhouette_8 from "../assets/silhouette_8.jpeg"
import silhouette_9 from "../assets/silhouette_9.jpeg"
import silhouette_female_1 from "../assets/silhouette_female_1.webp"
import silhouette_female_2 from "../assets/silhouette_female_2.jpeg"
import silhouette_female_3 from "../assets/silhouette_female_3.webp"
import {computed, onUnmounted, reactive, ref, unref, watch, watchEffect} from "vue";
import {computedAsync} from "@vueuse/core";
import {createImage} from "../resources.js";

const $model = defineModel();

const options = reactive([
  {url: silhouette_1},
  {url: silhouette_2},
  {url: silhouette_4},
  {url: silhouette_6},
  {url: silhouette_7},
  {url: silhouette_8},
  {url: silhouette_9},
  {url: silhouette_female_1},
  {url: silhouette_female_2},
  {url: silhouette_female_3},
]);
const handles = [];

const $selected = ref(null);
const $file = ref(null);

function onFilePick(event) {
  const file = event.target.files[0];
  if (!file) return;
  const entry = {
    url: URL.createObjectURL(file),
    file,
  };
  options.unshift(entry);
  handles.push(entry.url);
  $selected.value = entry;
}

onUnmounted(() => {
  handles.forEach(handle => URL.revokeObjectURL(handle));
});

const $selectedAsImage = computedAsync(async () => {
  const selected = unref($selected);
  if (!selected) {
    return null;
  } else {
    return selected.file ||= await createImage(selected.url);
  }
});

watch($selectedAsImage, selected => {
  if (selected) {
    $model.value = selected;
  }
});

</script>

<template>
  <fieldset>
    <label key="upload-button">
      <input
          id="upload"
          type="file"
          name="upload"
          capture="user"
          @change="onFilePick"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-6 -6 36 36" class="upload-icon">
        <!-- Based on https://iconmonstr.com/upload-4 -->
        <path d="M8 10h-5l9-9 9 9h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z" shape-rendering="crispEdges" />
      </svg>
    </label>
    <label v-for="item in options" :key="item.url">
      <input
          type="radio"
          name="image"
          :value="item"
          v-model="$selected"
      >
      <img :src="item.url" />
    </label>
  </fieldset>
</template>

<style scoped>
fieldset {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  border: none;
  padding: 0;
}

img, svg {
  /* Force the element to a 128x128 square */
  width: 128px;
  height: 128px;
  /* Round the square to a circle */
  border-radius: 100%;
  /* Fit into image to the circle area */
  object-fit: cover;
}

/* Hide the file picker, it is wrapped in a label */
input[type=file] {display: none;}

input[type=radio] {
  /* Make the element invisible, in a way that keyboard navigation still works. */
  opacity: 0;
  /* Force the element to take up no space. */
  display: block;
  width: 0;
  height: 0;
}

input:checked + img, input:focus + img {
  box-shadow: 0 0 5px 5px white;
}

.upload-icon {
  background: #ddd;
  fill: #222;
}
</style>
