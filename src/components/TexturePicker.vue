<script setup>
import {computed, ref, toValue, watch, watchEffect} from "vue";
import ColorBadge from "./ColorBadge.vue";

const props = defineProps({
  legend: {type: String, default: null},
  fieldname: {type: String, default: ''},
  presets: {type: Array}, // {label: 'Preset: v3', value: 'asdf'}
});
const $model = defineModel();

/**
 * @typedef {{
 *   label:string,
 *   value:string,
 *   type:'color'|'url',
 * }} PresetEntry
 */

/** @type {ComputedRef<(PresetEntry & {key:string})[]>} */
const $presets = computed(() => {
  const entries = [
    {label: 'Transparent', value: 'transparent', type: 'color'},
    {label: 'Black', value: 'black', type: 'color'},
    {label: 'Gray', value: 'gray', type: 'color'},
    {label: 'White', value: 'white', type: 'color'},
    ...(Array.isArray(props.presets) ? props.presets : []),
  ];
  return entries.map(entry => ({
    key: `preset-${entry.value}`,
    ...entry,
  }));
});

const $type = ref('preset-transparent');
/** @type {import('vue').Ref<null|PresetEntry>} */
const $preset = ref($presets.value[0]);
const $file = ref(null);
const $color = ref('');
const $background = computed(() => {
  const type = $type.value;
  if (type.startsWith('preset')) {
    const entry = $preset.value;
    switch (entry?.type) {
      case 'color':
        return encodeColorSvg(entry.value);
      case "url":
        return entry.value;
      case "computed":
        return toValue(entry.value);
      default:
        return undefined;
    }
  }
  switch (type) {
    case 'color':
      return encodeColorSvg($color.value);
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
    <label v-for="entry in $presets" :key="entry.key">
      <input type="radio" :name="fieldname" :value="entry.key" v-model="$type" @change="$preset = entry">
      {{ entry.label }}
      <ColorBadge v-if="entry.type=='color'" :color="entry.value" dark />
    </label>
    <label>
      <input type="radio" :name="fieldname" value="color" v-model="$type">
      Color
      <input type="color" v-model="$color" @input="$type = 'color'">
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
