<script setup>
import {computed, onUnmounted, ref, unref} from "vue";
import PersonalCard from "../components/PersonalCard.vue";
import {createImage} from "../resources.js";
import badgeUrl from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import foilUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";
import TexturePicker from "../components/TexturePicker.vue";
import AvatarPicker from "../components/AvatarPicker.vue";
import {colorToHex} from "../colors.js";
import ColorBadge from "../components/ColorBadge.vue";
import {computedAsync} from "@vueuse/core";
import {loadImageFromBlob} from "../regl/utilities.js";
import {pxRatio} from "../canvas.js";
import {Vec2} from "../Vec2.js";

const $title = ref('Line 1');
const $subtitle = ref('Line 2');

/**
 * @template T
 * @typedef {T|string} StrHint
 */

/**
 * @type {Ref<
 *   | StrHint<`data:image/svg+xml;${string}`>
 *   | StrHint<`/path/to/img.png`>
 *   | Blob
 *   | null
 * >}
 */
const $background = ref(badgeUrl);
const $foil = ref(foilUrl);
const $avatar = ref(null);
const $glow = ref(colorToHex('deepskyblue'));
const $textColor = ref(colorToHex('white'));
const $textOutline = ref(colorToHex('transparent'));
const $textShadow = ref(colorToHex('deepskyblue'));
const sizeDefault = [600, 846];
const sizeSquare = [400, 400];
const $sizeBg = computed(() => {
  const img = unref($backgroundImage);
  if (!img) return undefined;
  const {width,height} = img;
  return [width, height];
});
const $sizeBgScaled = computed(() => {
  const size = Vec2.parse(unref($sizeBg) ?? [0,0]);
  if (size.isZero) return undefined;

  const maxSize = 800;
  const longSide = Math.max(size.x, size.y);
  if (longSide < maxSize) return undefined;

  return size.multiply(maxSize / longSide).round().toArray();
});
const $size = ref(sizeDefault);

const colorPresets = [
    'transparent',
  'black',
  'white',
  // Red
  'red',
    // Orange
    // Yellow
  'yellow',
    // Greens
  'lawngreen',
  'lime',
  'green',
    // Blues
  'lightcyan',
  'aqua',
  'deepskyblue',
    // Indigo
    // Violet
  'violet',
  'darkviolet',
];

/** @type {import('vue').Ref<HTMLImageElement|undefined>} */
const $backgroundImage = computedAsync(async () => {
  const background = unref($background);
  if (!background) return;

  return (background instanceof Blob)
      ? await loadImageFromBlob(background)
      : await createImage(background);
});

const $backgroundAutoFoil = computed(() => {
  const img = unref($backgroundImage);
  if (!img) return;
  const {width, height} = img;
  console.log('Converting background, size:', width, 'x', height);

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width / pxRatio}px`;
  canvas.style.height = `${height / pxRatio}px`;
  canvas.style.border = '1px solid white';
  const ctx = canvas.getContext('2d');
  console.assert(!!ctx, 'Failed to create 2d context');
  ctx.drawImage(img, 0, 0);

  const pixels = ctx.getImageData(0, 0, width, height);
  console.log('pixels', pixels);

  function forEachPixel(fn) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (x + y * width) * 4;
        let r = pixels.data[index + 0];
        let g = pixels.data[index + 1];
        let b = pixels.data[index + 2];
        let a = pixels.data[index + 3];

        fn(r, g, b, a, x, y, index, pixels.data);
      }
    }
  }

  forEachPixel((r, g, b, a, x, y, index, array) => {
    const grayscale = (r * 0.2989) + (g * 0.5870) + (b * 0.1140);
    const levelled = threshold(grayscale, 0.2, 0.1);

    pixels.data[index] = grayscale * 0xFF;
    pixels.data[index + 1] = levelled * 0xFF;
    pixels.data[index + 2] = levelled * 0xFF;

  });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (x + y * width) * 4;
      let r = pixels.data[index + 0] / 0xFF;
      let g = pixels.data[index + 1] / 0xFF;
      let b = pixels.data[index + 2] / 0xFF;
      let a = pixels.data[index + 3];

      // 1. Convert to black-and-white
      const grayscale = (r * 0.2989) + (g * 0.5870) + (b * 0.1140);

      const levelled = threshold(grayscale, 0.2, 0.1);

      pixels.data[index] = grayscale * 0xFF;
      pixels.data[index + 1] = levelled * 0xFF;
      pixels.data[index + 2] = levelled * 0xFF;
    }
  }

  ctx.putImageData(pixels, 0, 0);

  function threshold(x, boundary, grace) {
    // 0..boundary..1
    // 0..boundary-grace => 0
    // boundary+grace..1 => 1
    const lower = boundary - grace;
    const upper = boundary + grace;
    if (x < lower) return 0;
    if (x > upper) return 1;

    const local = (x - boundary) / grace;

    return [local, local + 1];
  }

  function sigmoid(x) {
    const ex = Math.exp(x);
    return ex / (1 + ex);
  }
});


const backgroundPresets = [
  {label: 'DevWorld Sample Badge v3', value: badgeUrl, type: 'url'},
];
const foilPresets = [
  {label: 'DevWorld Sample Badge v3', value: foilUrl, type: 'url'},
  {label: 'Automaticly convert background', value: $backgroundAutoFoil, type: 'computed'}
];

</script>
<template>
  <div class="card-builder">
    <form>
      <fieldset>
        <legend>Canvas</legend>
        <label>
          <input type="radio" name="size" :value="sizeDefault" v-model="$size">
          Default ({{ sizeDefault[0] }}x{{ sizeDefault[1] }})
        </label>
        <label>
          <input type="radio" name="size" :value="sizeSquare" v-model="$size">
          Square ({{ sizeSquare[0]}}x{{sizeSquare[1]}})
        </label>
        <label v-if="$sizeBgScaled">
          <input type="radio" name="size" :value="$sizeBgScaled" v-model="$size">
          Scaled background ({{ $sizeBgScaled[0]}}x{{$sizeBgScaled[1]}})
        </label>
        <label v-if="$sizeBg">
          <input type="radio" name="size" :value="$sizeBg" v-model="$size">
          Full background ({{ $sizeBg[0]}}x{{$sizeBg[1]}})
        </label>
      </fieldset>
      <fieldset>
        <legend>Glow</legend>
        <label>
          Color:
          <input type="color" v-model="$glow">
        </label>
        <button v-for="preset in colorPresets" :key="preset" type="button" @click.prevent="$glow = colorToHex(preset)">
          <ColorBadge :color="preset" />
          <code>{{ preset }}</code>
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
        <button
            v-for="preset in colorPresets"
            :key="preset"
            type="button"
            @click.prevent="$textColor = colorToHex(preset)"
        >
          <span style="text-shadow: 0 0px 1px black" :style="`color:${preset}`">■</span> <code>{{ preset }}</code>
        </button>
        <label>
          Outline: <input type="color" v-model="$textOutline">
        </label>
        <button
            v-for="preset in colorPresets"
            :key="preset"
            type="button"
            @click.prevent="$textOutline = colorToHex(preset)"
        >
          <span style="text-shadow: 0 0px 1px black" :style="`color:${preset}`">■</span> <code>{{ preset }}</code>
        </button>
        <label>
          Shadow: <input type="color" v-model="$textShadow">
        </label>
        <button
            v-for="preset in colorPresets"
            :key="preset"
            type="button"
            @click.prevent="$textShadow = colorToHex(preset)"
        >
          <span style="text-shadow: 0 0px 1px black" :style="`color:${preset}`">■</span> <code>{{ preset }}</code>
        </button>
      </fieldset>
      <TexturePicker legend="Background" fieldname="background" v-model="$background" :presets="backgroundPresets" />
      <TexturePicker legend="Foil" fieldname="foil" v-model="$foil" :presets="foilPresets" />
      <fieldset>
        <legend>Avatar</legend>
        <AvatarPicker v-model="$avatar" />
      </fieldset>
    </form>
    <div class="card-canvas">
      <PersonalCard
          :background="$background"
          :foil="$foil"
          :avatar="$avatar"
          :title="$title"
          :subtitle="$subtitle"
          :glow="$glow"
          :textColor="$textColor"
          :textShadowColor="$textShadow"
          :textStrokeColor="$textOutline"
          :textStrokeWidth="4"
          :cardSize="$size"
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

form {
  max-width: 600px;
  min-width: 350px;
}

.card-canvas {
  flex-grow: 1;
  flex-shrink: 0;
  min-width: 600px;

  /* Center the canvas if there is space left over. */
  & canvas {
    margin: auto;
    display: block;
  }
}

</style>
