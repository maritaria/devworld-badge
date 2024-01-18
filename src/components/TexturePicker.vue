<script setup>
import {computed, ref, watch, watchEffect} from "vue";
import {watchLog} from "../vue/development.js";

defineProps({
  legend: {type: String, default: null},
  fieldname: {type:String, default: ''},
});
const $model = defineModel();

const $type = ref('none');
const $color = ref('#000000');
const $file = ref(null);
const $background = computed( () => {
  const type = $type.value;
  if (type.startsWith('color')) {
    return encodeColorSvg($color.value);
  }

  switch (type) {
    case 'file':
      return $file.value;
    case 'none':
      return encodeColorSvg('transparent');
    default:
      return undefined;
  }
});
watch($background, background => void ($model.value = background), {immediate: true});

function encodeColorSvg(color) {
  const xmlns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(xmlns, 'svg');

  svg.setAttribute('width', `1`);
  svg.setAttribute('height', `1`);
  svg.setAttribute('viewBox', `0 0 1 1`);
  svg.style.background = color;

  const xml = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
}

function onBgFilePick(event) {
  $file.value = event.target.files[0] ?? null;
  $type.value = 'file';
}

function onBgColorPick(event) {
  $type.value = 'color';
}

</script>

<template>
  <fieldset>
    <legend>{{legend}}</legend>
    <label>
      <input type="radio" :name="fieldname" value="color-transparent" v-model="$type" @change="$color = 'transparent'">
      Transparent
    </label>
    <label>
      <input type="radio" :name="fieldname" value="color-black" v-model="$type" @change="$color = 'black'">
      Black
    </label>
    <label>
      <input type="radio" :name="fieldname" value="color-gray" v-model="$type" @change="$color = 'gray'">
      Gray
    </label>
    <label>
      <input type="radio" :name="fieldname" value="color-white" v-model="$type" @change="$color = 'white'">
      White
    </label>
    <label>
      <input type="radio" :name="fieldname" value="color" v-model="$type">
      Color
      <input type="color" v-model="$color" @input="onBgColorPick">
    </label>
    <label>
      <input type="radio" :name="fieldname" value="file" v-model="$type">
      Image:
      <input type="file" accept="image/*" @change="onBgFilePick">
    </label>
  </fieldset>
</template>

<style scoped>
label {
  display: block;
}
</style>
