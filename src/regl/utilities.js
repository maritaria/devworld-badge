import createREGL from "regl";
import {pxRatio} from "../canvas.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} width
 * @param {number} height
 * @param {number} pixelRatio
 * @return {REGL.Regl}
 */
export function initCanvas(canvas, {width, height}, pixelRatio = pxRatio) {
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  return createREGL(canvas);
}

/**
 * @param {REGL.Regl} regl
 * @param {string} src
 * @param {REGL.Texture2DOptions} extra
 * @return {Promise<REGL.Texture2D>}
 */
export function loadTexture(regl, src, extra = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(regl.texture({
        data: img,
        min: 'linear',
        mag: 'linear',
        ...extra,
      }));
    };
    img.onerror = (event, source, lineno, colno, cause) => {
      const error = new Error("Image failed to load");
      error.cause = cause;
      reject(error);
    };
  });
}
