<script setup>
import CardBase from "./CardBase.vue";
</script>

<template>
  <CardBase class="card-v3">
    <img src="https://images.pokemontcg.io/sm10/33_hires.png">
    <div class="card-shine"></div>
    <div class="card-glare"></div>
  </CardBase>
</template>

<style scoped>
.card-v3 {
  --sunpillar-1: hsl(2, 100%, 73%);
  --sunpillar-2: hsl(53, 100%, 69%);
  --sunpillar-3: hsl(93, 100%, 69%);
  --sunpillar-4: hsl(176, 100%, 76%);
  --sunpillar-5: hsl(228, 100%, 74%);
  --sunpillar-6: hsl(283, 100%, 73%);
  --sunpillar-clr-1: var(--sunpillar-1);
  --sunpillar-clr-2: var(--sunpillar-2);
  --sunpillar-clr-3: var(--sunpillar-3);
  --sunpillar-clr-4: var(--sunpillar-4);
  --sunpillar-clr-5: var(--sunpillar-5);
  --sunpillar-clr-6: var(--sunpillar-6);

  --seedx: 0.023049157831819156;
  --seedy: 0.05699415673751562;
  --cosmosbg: 16px 72px;
  --grain: url("https://poke-holo.simey.me/img/grain.webp");
  --glitter: url("https://poke-holo.simey.me/img/glitter.png");
  --space: 5%;
  --angle: 133deg;
  --imgsize: 500px;

  .card-shine {
    opacity: var(--glare-opacity);
    mix-blend-mode: color-dodge;
    background-image: var(--grain),
    repeating-linear-gradient(0deg, var(--sunpillar-clr-1) calc(var(--space) * 1),
        var(--sunpillar-clr-2) calc(var(--space) * 2),
        var(--sunpillar-clr-3) calc(var(--space) * 3),
        var(--sunpillar-clr-4) calc(var(--space) * 4),
        var(--sunpillar-clr-5) calc(var(--space) * 5),
        var(--sunpillar-clr-6) calc(var(--space) * 6),
        var(--sunpillar-clr-1) calc(var(--space) * 7)),
    repeating-linear-gradient(
        var(--angle),
        #0e152e 0%,
        hsl(180, 10%, 60%) 3.8%,
        hsl(180, 29%, 66%) 4.5%,
        hsl(180, 10%, 60%) 5.2%,
        #0e152e 10%,
        #0e152e 12%
    ),
    radial-gradient(
        farthest-corner circle at var(--pointer-x) var(--pointer-y),
        hsla(0, 0%, 0%, 0.1) 12%,
        hsla(0, 0%, 0%, 0.15) 20%,
        hsla(0, 0%, 0%, 0.25) 120%
    );
    background-blend-mode: screen, hue, hard-light;
    background-size: var(--imgsize) 100%,
    200% 700%,
    300% 100%,
    200% 100%;
    background-position: center,
    0% var(--background-y),
    var(--background-x) var(--background-y),
    var(--background-x) var(--background-y);
    filter: brightness(.8) contrast(2.95) saturate(.65);

    &::after {
      content: "";
      position: absolute;
      top: 0; bottom: 0; left: 0; right: 0;
      background-image: var(--grain),
      repeating-linear-gradient(
          0deg,
          var(--sunpillar-clr-1) calc(var(--space) * 1),
          var(--sunpillar-clr-2) calc(var(--space) * 2),
          var(--sunpillar-clr-3) calc(var(--space) * 3),
          var(--sunpillar-clr-4) calc(var(--space) * 4),
          var(--sunpillar-clr-5) calc(var(--space) * 5),
          var(--sunpillar-clr-6) calc(var(--space) * 6),
          var(--sunpillar-clr-1) calc(var(--space) * 7)
      ),
      repeating-linear-gradient(
          var(--angle),
          #0e152e 0%,
          hsl(180, 10%, 60%) 3.8%,
          hsl(180, 29%, 66%) 4.5%,
          hsl(180, 10%, 60%) 5.2%,
          #0e152e 10%,
          #0e152e 12%
      ),
      radial-gradient(
          farthest-corner circle at var(--pointer-x) var(--pointer-y),
          hsla(0, 0%, 0%, 0.1) 12%,
          hsla(0, 0%, 0%, 0.15) 20%,
          hsla(0, 0%, 0%, 0.25) 120%
      );
      background-blend-mode: screen, hue, hard-light;
      background-position: center,
      0% var(--background-y),
      calc(var(--background-x) * -1) calc(var(--background-y) * -1),
      var(--background-x) var(--background-y);
      background-size: var(--imgsize) 100%, 200% 400%, 195% 100%, 200% 100%;
      filter: brightness(1) contrast(2.5) saturate(1.75);
      mix-blend-mode: soft-light;
      --sunpillar-clr-1: var(--sunpillar-6);
      --sunpillar-clr-2: var(--sunpillar-1);
      --sunpillar-clr-3: var(--sunpillar-2);
      --sunpillar-clr-4: var(--sunpillar-3);
      --sunpillar-clr-5: var(--sunpillar-4);
      --sunpillar-clr-6: var(--sunpillar-5);
      transform: translateZ(1.2px);
    }
  }

  .card-glare {
    background-image: radial-gradient(
        farthest-corner circle at var(--pointer-x) var(--pointer-y),
        hsl(0, 0%, 100%) 0%,
        hsla(210, 3%, 54%, 0.33) 45%,
        hsla(0, 0%, 20%, 0.9) 130%
    );
    mix-blend-mode: hard-light;
    opacity: calc(var(--glare-opacity) * 0.5);
    filter: brightness(.9) contrast(1.75);
    transform: translateZ(1.41px);
  }
  .card-glare-alt {
    background: radial-gradient(
        farthest-corner circle at var(--pointer-x) var(--pointer-y),
        hsla(0, 0%, 100%, 0.8) 10%,
        hsla(0, 0%, 100%, 0.65) 20%,
        hsla(0, 0%, 0%, 0.5) 90%
    );
    mix-blend-mode: soft-light;
    opacity: var(--glare-opacity);
  }
}
</style>
