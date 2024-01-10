/**
 * @param {number} width
 * @param {number} height
 * @return {OffscreenCanvas | HTMLCanvasElement}
 */
export function makeOffscreenCanvas(width, height) {
  /** @type {OffscreenCanvas | HTMLCanvasElement} */
  return ('OffscreenCanvas' in window)
    ? new OffscreenCanvas(width * pxRatio, height * pxRatio)
    : makeCanvas(width, height);

  function makeCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * pxRatio;
    canvas.height = height * pxRatio;
    return canvas;
  }
}

export const pxRatio = (() => {
  if (window.devicePixelRatio === 1 || window.devicePixelRatio === 2) {
    return window.devicePixelRatio;
  } else {
    // User has active zoom, this can throw off the devicePixelRatio.
    return 1;
  }
})();
