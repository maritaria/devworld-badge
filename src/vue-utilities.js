import {reactive} from "vue";

export function useMousePosition() {
  const mouse = reactive({x: 0.5, y: 0.5});
  return {
    mouse,
    onMouseMove,
    onMouseLeave,
  };
  /** @param {MouseEvent} event */
  function onMouseMove(event) {
    const rect = event.target.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / rect.width;
    mouse.y = (event.clientY - rect.top) / rect.height;
  }
  /** @param {MouseEvent} event */
  function onMouseLeave(event) {
    mouse.x = 0.5;
    mouse.y = 0.5;
  }
}
