
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
