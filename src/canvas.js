/**
 * @param {number} width
 * @param {number} height
 * @return {OffscreenCanvas | HTMLCanvasElement}
 */
export function makeOffscreenCanvas(width, height) {
  /** @type {OffscreenCanvas | HTMLCanvasElement} */
  return ('OffscreenCanvas' in window)
    ? new OffscreenCanvas(width, height)
    : makeCanvas(width, height);

  function makeCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    return canvas;
  }
}
