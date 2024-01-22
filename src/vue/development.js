import {toValue, watchEffect} from "vue";

export function watchLog(name, $value) {
  watchEffect(() => console.log(`watchLog(${name})`, toValue($value)));
}
