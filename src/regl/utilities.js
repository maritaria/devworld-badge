import createREGL from "regl";
import {pxRatio} from "../canvas.js";
import {createImage} from "../resources.js";

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

/**
 * Converts a given blob (or file) into a {@link REGL.Texture2D}.
 * @param {REGL.Regl} regl
 * @param {Blob} blob
 * @return {Promise<REGL.Texture2D>}
 */
export async function loadTextureFromBlob(regl, blob) {
  return regl.texture(await loadImageFromBlob(blob));
}

/**
 * @param {Blob} blob
 * @return {Promise<HTMLImageElement>}
 */
export async function loadImageFromBlob(blob) {
  const url = URL.createObjectURL(blob);
  try {
    return await createImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function frameLoop(regl, fn) {
  const handle = regl.frame(() => {
    try {
      fn();
    } catch (primary) {
      try {
        safeCancel(handle);
      } catch (secondary) {
        console.error('Error ocurred in safeCancel!', secondary);
      }
      throw primary;
    }
  });
  return () => safeCancel(handle);
}

function safeCancel(handle) {
  try {
    handle.cancel();
  } catch (err) {
    if (typeof err?.message === 'string') {
      if (err.message.includes('cannot cancel a frame twice')) {
        // Surpress the error
        return;
      }
    }
    throw err;
  }
}
