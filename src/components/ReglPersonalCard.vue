<script setup>
import {ref} from 'vue';
import AvatarPicker from "./AvatarPicker.vue";
import PersonalCard from "./PersonalCard.vue";

import backgroundUrl from "../assets/doc/niki-devworld-badge-sample-3.jpg";
import foilUrl from "../assets/doc/niki-devworld-badge-sample-3-foil-v3.jpg";

// todo:
//     1. switch the background to black
//     2. switch neon color to green (the 3rd option in the cards list)
//     3. Add generic shine glow to background (try by disabling foil or using white surface)
//     4.

const $name = ref('Bram Kamies');
const $avatar = ref(null);
const $background = ref(backgroundUrl);

</script>
<template>
  <form @submit.prevent>
    <label>
      Name:
      <input type="text" v-model="$name" placeholder="Bram Kamies">
    </label>
    <span>Picture:</span>
    <AvatarPicker v-model="$avatar" />
  </form>
  <PersonalCard :title="$name" :avatar="$avatar" :background="backgroundUrl" :foil="foilUrl" />
</template>
