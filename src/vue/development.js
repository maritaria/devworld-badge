import {isProxy, markRaw, toRaw, toValue, triggerRef, watchEffect} from "vue";

export function watchLog(name, $value) {
  watchEffect(() => console.log(`watchLog(${name})`, toValue($value)));
}
