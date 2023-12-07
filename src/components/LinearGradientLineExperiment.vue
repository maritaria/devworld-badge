<script setup>
import {reactive, ref, computed, unref} from "vue";
import {Vec2} from "../Vec2.js";
import {round, toDegrees, toRadians, wrap} from "../math.js";
import {linearGradientLength} from "../linear-gradient.js";

/**
 * to bottom = 180deg = (top 0%, bottom 100%) -- default
 * to top    = 0deg   = (bottom 0%, top 100%)
 * to left   = 270deg = (right 0%, left 100%)
 * to right  = 90deg  = (left 0%, right 100%)
 * @type {Ref<UnwrapRef<number>>}
 */
const angle = ref(-15);

const clearance = ref(100);

const box = reactive({
  width: 200,
  height: 200,
});

const angleDelta = computed(() => Vec2.fromAngle(angle.value));
const angleArrow = computed(() => angleDelta.value.multiply(1000));
const diagonal = computed(() => Math.sqrt(box.width ** 2 + box.height ** 2));

const beta = computed(() => toDegrees(Math.atan2(box.height, box.width)));
const betaArrow = computed(() => Vec2.fromAngle(beta.value, 100));
const theta = computed(() => wrap(angle.value - beta.value, -180, 180));
const thetaArrow = computed(() => Vec2.fromAngle(beta.value + theta.value, 40));
const slope = computed(() => Math.sin(toRadians(theta.value)));
const length = computed(() => linearGradientLength(box.width, box.height, angle.value));

function drawArrow(vector, origin, props) {
  vector = unref(vector);
  origin = Vec2.coerceArgs(unref(origin) ?? 0);
  const end = origin.add(vector);
  return {
    ...props,
    x1: origin.x,
    y1: origin.y,
    x2: end.x,
    y2: end.y,
  };
}

const lines = computed(() => [
  drawArrow(angleArrow, [0, 0], {stroke: 'aqua'}),
  drawArrow(angleArrow.value.multiply(-1), [0, 0], {stroke: 'aqua'}),
  drawArrow(betaArrow, [0, 0], {stroke: 'red'}),
  drawArrow(thetaArrow, [0, 0], {stroke: 'yellow'}),

  (() => {
    const start = new Vec2(box.width, box.height);
    const delta = Vec2.fromAngle(angle.value - 90, theta.value > 0 ? -length.value : length.value);
    const end = start.add(delta);
    return {x1: start.x, y1: start.y, x2: end.x, y2: end.y, stroke: 'lightgreen'};
  })(),
].filter(Boolean));

const circles = computed(() => [
  {cx: 0, cy: 0, r: 4, fill: 'white'},
  {cx: box.width, cy: box.height, r: 4, fill: 'lightgreen'},
].filter(Boolean));

const debug = computed(() => {
  return {
    width: box.width,
    height: box.height,
    diagonal: round(diagonal.value),
    angle: round(angle.value),
    beta: round(beta.value),
    theta: round(theta.value),
    slope: round(slope.value),
    length: round(length.value),
  };
});

const $div = ref(null);

/** @param {MouseEvent} event */
function onMouseMove(event) {
  if (!$div.value) return;
  const rect = $div.value.getBoundingClientRect();
  const absolute = {
    x: event.clientX - rect.left - clearance.value,
    y: event.clientY - rect.top - clearance.value,
  };

  const mouseAngle = Math.atan2(absolute.y, absolute.x);
  angle.value = toDegrees(mouseAngle);
}

/** @param {MouseEvent} event */
function onMouseOut(event) {
  if (event.target !== $div.value) return;
  angle.value = -45;
}

</script>

<template>
  <div ref="$div" @mousemove="onMouseMove" @mouseout="onMouseOut">
    <svg
        :viewBox="`-${clearance} -${clearance} ${box.width + clearance*2} ${box.height + clearance*2}`"
        :width="`${box.width + clearance * 2}px`"
        :height="`${box.height + clearance * 2}`"
        style="background:grey;"

    >
      <rect x="0" y="0" :width="box.width" :height="box.height"></rect>
      <line v-for="line in lines" v-bind="line" />
      <circle v-for="circle in circles" v-bind="circle" />
    </svg>
  </div>
  <pre>{{ JSON.stringify(debug, null, 2) }}</pre>
</template>

<style scoped>

</style>
