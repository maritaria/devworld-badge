import {ScrambledText} from "../scrambled-text.js";
import {useInterval, useIntervalFn, useRafFn} from "@vueuse/core";
import {ref, toValue, watchEffect} from "vue";

/**
 * @param {import('vue').MaybeRefOrGetter<string>} $target
 * @param {ScrambledText?} instance
 * @param {number?} interval
 * @return {import('vue').Ref<string>}
 */
export function useScrambledText($target, {
  instance = new ScrambledText(),
  interval = 50,
} = {}) {
  const $output = ref('');
  watchEffect(() => {
    instance.target = toValue($target);
    instance.text = ['a'];
    instance.settled = [];
    instance.isScrambling = false;
    instance.scrambleChance = 0.05;
    instance.settleChance = 0.3;
    instance.unsettleChance = 0.6;
    instance.resizeChance = 0.6;
    tick();
  });

  let elapsed = 0;
  useRafFn(({delta})=> {
    elapsed += delta;
    let interval = 1000 / 30;
    while (elapsed > interval) {
      elapsed -= interval;
      tick();
    }
  });

  // useIntervalFn(tick, 1);
  return $output;

  function tick() {
    instance.update();
    $output.value = instance.text.join('');
  }
}
