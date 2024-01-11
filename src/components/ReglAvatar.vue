<script setup>
// Resources
import backgroundUrl from '../assets/doc/niki-devworld-badge-sample-3.jpg';
import avatarUrl from '../assets/doc/linkedin-black-friday-sale.png';
// Code
import {ref, unref, watchEffect} from "vue";
import {useRegl} from "../vue/use-regl.js";
import {computedAsync} from "@vueuse/core";
import {loadTexture} from "../regl/utilities.js";
import {makeTextureRenderer} from "../regl/texture-renderer.js";
import {Vec2} from "../Vec2.js";
import {makeAvatarRenderer} from "../regl/avatar-renderer.js";
import {useReglTexture} from "../vue/use-regl-texture.js";

const $canvas = ref(null);
const $regl = useRegl($canvas, {width: 300, height: 500});

const $background = useReglTexture($regl, backgroundUrl);
const $avatar = useReglTexture($regl, avatarUrl);

watchEffect(async () => {
  const regl = unref($regl);
  const background = unref($background);
  const avatar = unref($avatar);
  if (!regl || !background || !avatar) return;

  const drawTexture = makeTextureRenderer(regl);
  const drawAvatar = makeAvatarRenderer(regl);
  drawTexture({texture: background});
  drawAvatar(avatar, 100);
});
</script>
<template>
  <canvas ref="$canvas" />
</template>
