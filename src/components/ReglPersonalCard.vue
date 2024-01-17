<script setup>
import {ref} from 'vue';
import AvatarPicker from "./AvatarPicker.vue";
import PersonalCard from "./PersonalCard.vue";

// todo:
//     1. switch the background to black
//     2. switch neon color to green (the 3rd option in the cards list)
//     3. Add generic shine glow to background (try by disabling foil or using white surface)
//     4.

const $name = ref('Bram Kamies');
const $avatar = ref(null);

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
  <PersonalCard :title="$name" :avatar="$avatar" />
</template>
