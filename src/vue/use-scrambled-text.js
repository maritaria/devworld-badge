import {ScrambledText} from "../scrambled-text.js";
import {useInterval, useIntervalFn, useRafFn} from "@vueuse/core";
import {ref, toValue, watchEffect} from "vue";

export function useScrambledText($target, {
  instance = new ScrambledText(),
  interval = 50,
} = {}) {
  const $output = ref(null);
  watchEffect(() => {
    instance.target = toValue($target);
    instance.text = ['a'];
    instance.settled = [];
    instance.isScrambling = false;
    tick();
  });

  let elapsed = 0;
  useRafFn(({delta})=> {
    elapsed += delta;
    let interval = 50;
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
