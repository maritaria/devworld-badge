<template>
  <div class="card-sparkle"></div>
</template>

<style scoped>

.card-sparkle {
  background-image: url("https://assets.codepen.io/13471/sparkles.gif"),
  url(https://assets.codepen.io/13471/holo.png),
  linear-gradient(125deg,
      #ff008450 15%,
      #fca40040 30%,
      #ffff0030 40%,
      #00ff8a20 60%,
      #00cfff40 70%,
      #cc4cfa50 85%
  );
  background-position: 50% 50%;
  background-size: 160%;
  background-blend-mode: overlay;
  z-index: 2;
  filter: brightness(1) contrast(1);
  /*transition: all 0.33s ease;*/
  mix-blend-mode: color-dodge;
  opacity: calc(0.3 + 0.25 * var(--glare-opacity));
  /*background-position-x: calc(100% - var(--pointer-x));
  background-position-y: calc(100% - var(--pointer-y));*/
}
</style>
