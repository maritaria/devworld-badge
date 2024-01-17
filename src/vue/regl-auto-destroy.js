import {watch} from "vue";

export function autoDestroy($resource) {
  watch($resource, (value, _, onCleanup) => {
    if (value && value.destroy) {
      onCleanup(() => value.destroy());
    }
  });
}
