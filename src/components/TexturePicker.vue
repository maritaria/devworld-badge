<script setup>
import {computed, ref, watch, watchEffect} from "vue";
import {watchLog} from "../vue/development.js";
import {colorToHex} from "../colors.js";
import ColorBadge from "./ColorBadge.vue";

const props = defineProps({
  legend: {type: String, default: null},
  fieldname: {type: String, default: ''},
  presets: {type: Array}, // {label: 'Preset: v3', value: 'asdf'}
});
const $model = defineModel();

const $presets = computed(() => {
  const entries = [
    {label: 'Transparent', value: 'transparent'},
    {label: 'Black', value: 'black'},
    {label: 'Gray', value: 'gray'},
    {label: 'White', value: 'white'},
    ...(Array.isArray(props.presets) ? props.presets : []),
  ];
  return entries.map(entry => ({
    key: `preset-${entry.value}`,
    hex: tryParseColor(entry.value),
    ...entry,
  }));

  function tryParseColor(color) {
    try {
      return colorToHex(color);
    } catch {
      return 'transparent';
    }
  }
});

const $type = ref('preset-transparent');
const $preset = ref('#000000');
const $file = ref(null);
const $background = computed(() => {
  const type = $type.value;
  if (type.startsWith('preset')) {
    return encodeColorSvg($preset.value);
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

</script>

<template>
  <fieldset>
    <legend>{{ legend }}</legend>
    <label v-for="{label, value, key} in $presets" :key="key">
      <input type="radio" :name="fieldname" :value="key" v-model="$type" @change="$preset = value">
      {{ label }}
      <ColorBadge :color="value" dark />
    </label>
    <label>
      <input type="radio" :name="fieldname" value="color" v-model="$type">
      Color
      <input type="color" v-model="$preset" @input="$type = 'color'">
    </label>
    <label>
      <input type="radio" :name="fieldname" value="file" v-model="$type">
      Image:
      <input type="file" accept="image/*" @change="$type = 'file'; $file = $event.target.files[0];">
    </label>
  </fieldset>
</template>

<style scoped>
label {
  display: block;
}
</style>
