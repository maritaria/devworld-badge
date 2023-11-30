<script setup>

</script>

<template>
  <div class="devworld-neon">
    <div class="signage">
      <p class="title">DevWorld</p>
      <p class="subtitle">Digital access pass</p>
    </div>
    <div class="content">
      <div class="name">Bram Kamies</div>
      <div class="details">
        29 Feb & 1 March 2024, RAI Amsterdam
      </div>
    </div>
  </div>
</template>

<style scoped>
.devworld-neon {
  background: black;
  background: radial-gradient(
      circle farthest-side at 50% 10%,
      darkgreen -10%,
      black 100%
  );
  width: 600px;
  height: 600px;
  position: relative;
}

.signage {
  margin: 50px;
  margin-bottom: 0;
  box-shadow: lime 0 0 5px 5px,
  inset lime 0 0 10px 5px,
  lime 0 0 50px,
  inset darkgreen 0 0 50px;
  padding: 20px;

  position: relative;

  &::before {
    position: absolute;
    inset: 0;

    --air: transparent;
    --bars: white;
    color: none;
    background: repeating-linear-gradient(var(--air) 0px, var(--air) 9px, var(--bars) 10px, var(--air) 11px, var(--air) 20px),
    repeating-linear-gradient(0.25turn, var(--air) 0px, var(--air) 9px, var(--bars) 10px, var(--air) 11px, var(--air) 20px);
    mix-blend-mode: overlay;
    content: "";
  }

  /* Interesting: using the following overlay creates a super bright effect */

  & p {
    margin: 0;
    padding: 0;

    /* Spread chars */

    /* Neon signage */
    font-family: '3AM-Soft', monospace;

    color: white;
    text-shadow: lime 0 1px 5px, lime 0 0 20px, green 0 0 20px;

    &.title {
      font-size: 70px;
      text-align-last: justify;
      text-align: justify;
      text-justify: inter-character;
    }
    &.subtitle {
      margin: 0 50px 20px;
      font-family: "Rational Integer Regular", monospace;
      font-size: 40px;
      text-transform: uppercase;
      text-align: center;
    }
  }
}

.content {
  text-align: center;
}

.name {
  font-family: "Scriptina Regular";
  font-size: 100px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 80px;
  text-decoration: underline 3px dashed rgba(40%, 80%, 40%, 100%);
  text-decoration-skip-ink: none;
  background: radial-gradient(ellipse closest-side at center 60%, green -40%, transparent 100%);
}

.details {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  font-family: monospace;

  margin-inline: 30px;
  padding-top: 5px;
  font-size: 20px;
}

@font-face {
  src: url("/library-3-am.3amsoft.otf");
  font-family: '3AM-Soft';
}

@font-face {
  src: url("/rational-integer.ttf");
  font-family: "Rational Integer Regular";
}

@font-face {
  src: url("/scriptina.regular.ttf");
  font-family: "Scriptina Regular";
}

</style>
