import {computed, reactive, unref, watch} from "vue";
import {useRafFn} from "@vueuse/core";

/**
 * Create a value that is headed towards a given goal.
 * When the goal changes value the spring will start pulling its own value towards
 *
 * @param {import('vue').Ref<number>} $target - The reactive source the spring pulls towards
 * @param opts
 * @return {import('vue').ComputedRef<number>}
 *
 * @see https://github.com/sveltejs/svelte/blob/570884eabda10a28e640ae3fdeae64c2f1a587b8/packages/svelte/src/motion/spring.js
 */
export function useSpring($target, opts = {}) {
  const initial = +(unref($target));
  assertNumber(initial, 'initial');

  const state = reactive({
    valuePrevious: initial,
    valueCurrent: initial,
    valueTarget: initial,
    stiffness: opts.stiffness ?? 0.15,
    damping: opts.damping ?? 0.8,
    precision: opts.precision ?? 0.01,
    inv_mass: 1,
    dt: 1 / 60,
    lastTime: performance.now(),
  });

  const $raf = useRafFn(function useSpring_tick({timestamp}) {
    state.dt = (timestamp - state.lastTime) * 60 / 1000;
    state.dt ||= 1 / 60;

    const delta = state.valueTarget - state.valueCurrent;
    const velocity = (state.valueCurrent - state.valuePrevious) / (state.dt || 1 / 60); // guard div by 0
    const spring = state.stiffness * delta;
    const damper = state.damping * velocity;
    const acceleration = (spring - damper) * state.inv_mass;
    const change = (velocity + acceleration) * state.dt;

    const targetReached =
      Math.abs(change) < state.precision &&
      Math.abs(delta) < state.precision;
    if (targetReached) {
      $raf.pause(); // Target reached
      state.valueCurrent = state.valueTarget;
    } else {
      state.valuePrevious = state.valueCurrent;
      state.valueCurrent = state.valueCurrent + change;
    }

    state.lastTime = timestamp;
  }, {immediate: false});

  watch($target, function onSpringSourceChange(newTarget) {
    // Set the target
    state.valueTarget = +newTarget;
    assertNumber(state.valueTarget, `state.valueTarget`);
    // If the value has previously stabilized, then resume the update loop
    if (!$raf.isActive.value) {
      $raf.resume();
      // Prevent a large initial delta by updating the timestamp when unpausing the update loop
      state.lastTime = performance.now();
    }
  });

  return computed(() => state.valueCurrent);

  function assertNumber(value, field) {
    console.assert(!isNaN(value), `Value of '${field}' is NaN!`);
  }
}
