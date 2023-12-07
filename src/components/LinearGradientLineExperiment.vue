<script setup>
import {reactive, ref, computed, unref} from "vue";

/**
 * to bottom = 180deg = (top 0%, bottom 100%) -- default
 * to top    = 0deg   = (bottom 0%, top 100%)
 * to left   = 270deg = (right 0%, left 100%)
 * to right  = 90deg  = (left 0%, right 100%)
 * @type {Ref<UnwrapRef<number>>}
 */
const angle = ref(-45);

const clearance = ref(100);

const box = reactive({
  width: 200,
  height: 200,
});

const angleDelta = computed(() => fromAngle(angle.value));
const angleArrow = computed(() => multiply(angleDelta.value, 1000));
const diagonal = computed(() => Math.sqrt(box.width ** 2 + box.height ** 2));

const beta = computed(() => toDegrees(Math.atan2(box.height, box.width)));
const betaArrow = computed(() => fromAngle(beta.value, 100));
const theta = computed(() => angle.value - beta.value);
const thetaArrow = computed(() => fromAngle(beta.value + theta.value, 40));
const slope = computed(() => Math.sin(toRadians(theta.value)));
const length = computed(() => slope.value * diagonal.value);

function drawArrow(vector, origin, props) {
  vector = unref(vector);
  return {
    ...props,
    x1: origin[0],
    y1: origin[1],
    x2: origin[0] + vector[0],
    y2: origin[1] + vector[1],
  };
}

const lines = computed(() => [
  drawArrow(angleArrow, [0, 0], {stroke: 'aqua'}),
  drawArrow(betaArrow, [0, 0], {stroke: 'red'}),
  drawArrow(thetaArrow, [0, 0], {stroke: 'yellow'}),

  (() => {
    const [x1, y1] = [box.width, box.height];
    const [dx, dy] = fromAngle(angle.value - 90, -length.value);
    const [x2, y2] = [x1 + dx, y1 + dy];
    return {x1, y1, x2, y2, stroke: 'lightgreen'};
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
    diagonal: rounded(diagonal.value),
    angle: rounded(angle.value),
    beta: rounded(beta.value),
    theta: rounded(theta.value),
    slope: rounded(slope.value),
    length: rounded(length.value),
  };
});

//region Utilities

function toDegrees(radians) {
  return wrap(radians * 180 / Math.PI, 360);
}

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function toAngle([x, y]) {
  return toDegrees(Math.atan2(y, x));
}

function rounded(number, decimals = 5) {
  return parseFloat(number.toFixed(decimals));
}

function fromAngle(degrees, length = 1) {
  const radians = toRadians(degrees);
  return [
    rounded(Math.cos(radians) * length),
    rounded(Math.sin(radians) * length),
  ];
}

function wrap(value, min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  const range = max - min;
  const offset = value - min;
  const wrapped = ((offset % range) + range) % range;
  return min + wrapped;
}

function normalize(v) {
  const [x, y] = (typeof v === 'number') ? [v, v] : v;
  const length = Math.sqrt(x ** 2 + y ** 2);
  if (length == 0) return [0, 0];
  return [
    x / length,
    y / length,
  ];
}

function multiply(v1, v2) {
  const [x1, y1] = (typeof v1 === 'number') ? [v1, v1] : v1;
  const [x2, y2] = (typeof v2 === 'number') ? [v2, v2] : v2;
  return [
    x1 * x2,
    y1 * y2,
  ];
}

function add(v1, v2) {
  const [x1, y1] = (typeof v1 === 'number') ? [v1, v1] : v1;
  const [x2, y2] = (typeof v2 === 'number') ? [v2, v2] : v2;
  return [
    x1 + x2,
    y1 + y2,
  ];
}

function divide(v1, v2) {
  const [x1, y1] = (typeof v1 === 'number') ? [v1, v1] : v1;
  const [x2, y2] = (typeof v2 === 'number') ? [v2, v2] : v2;
  if (x2 == 0 || y2 == 0) throw new TypeError("Divide by zero");
  return [
    x1 / x2,
    y1 / y2,
  ];
}

//endregion

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
  console.log('mouse', ...[absolute.x, absolute.y, toDegrees(mouseAngle)].map(i=>rounded(i, 1)));
  angle.value = toDegrees(mouseAngle);
}

/** @param {MouseEvent} event */
function onMouseOut(event) {
  if (event.target === $div.value)
  angle.value = -45;
}

</script>

<template>
  <div ref="$div"
      @mousemove="onMouseMove"
      @mouseout="onMouseOut"
  >
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
