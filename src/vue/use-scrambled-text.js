import {ScrambledText} from "../scrambled-text.js";
import {useInterval, useIntervalFn, useRafFn} from "@vueuse/core";
import {computed, markRaw, reactive, ref, toValue, watch, watchEffect} from "vue";

/**
 * @param {import('vue').MaybeRefOrGetter<string>} $target
 * @param {ScrambledText?} instance
 * @param {number?} interval
 * @return {{state: ScrambledText, text: import('vue').Ref<string>}}
 */
export function useScrambledText($target, {
  interval = 50,
} = {}) {
  /** @type {ScrambledText} */
  const $state = reactive(new ScrambledText());
  $state.scrambleChance = 0.02;
  $state.settleChance = 0.3;
  $state.unsettleChance = 0.6;
  $state.resizeChance = 0.6;

  watch($target, (target) => {
    $state.target = toValue($target);
    $state.reset();
    $state.update();
  }, {immediate: true});

  let elapsed = 0;
  useRafFn(({delta}) => {
    elapsed += delta;
    let interval = 1000 / 30;
    while (elapsed > interval) {
      elapsed -= interval;
      $state.update();
    }
  });

  return {
    state: $state,
    text: computed(() => $state.text.join('')),
  };
}

/**
 * Synchronize a list of scramblers to maintain the same state.
 * @param {ScrambledText} scramblers
 */
export function syncScramblers(...scramblers) {
  if (scramblers.length < 2) return;
  const stateJumps = {
    stable: 'scrambling',
    scrambling: 'shrinking',
    shrinking: 'growing',
    growing: 'settling',
    settling: 'stable',
  };
  const $target = ref('stable');

  // 1. When a scrambler reaches the target state then lock it.
  watchEffect(function autoLock() {
    scramblers.forEach(s => {
      s.locked |= (s.state === $target.value);
    });
  });

  // 2. When state is synchronized, unlock and roll to the next state.
  watchEffect(function rollover() {
    if (scramblers.every(s => s.locked)) {
      $target.value = stateJumps[$target.value];
      scramblers.forEach(s => void (s.locked = false));
    }
  });
}
