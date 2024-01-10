/**
 * Create an `<img>` and await the resource to load.
 * Handy for loading a data-url encoded image for rendering with a canvas.
 * @param url - The URL to the image
 * @return {Promise<HTMLImageElement>}
 */
export async function createImage(url) {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.decode = () => resolve(img);
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.src = url;
  });
}

/**
 * Creates a Regl texture that has the given html painted on it.
 * @param {REGL.Regl} regl
 * @param {string} html
 * @return {Promise<REGL.Texture2D>}
 */
export async function createHtmlTexture(regl, width, height, html) {
  const dataUrl = htmlToDataUrl(html, width, height);
  const img = await createImage(dataUrl);
  return regl.texture(img);

  /**
   * @param {string} html
   * @param {number} width
   * @param {number} height
   * @return {string}
   * @see https://github.com/bubkoo/html-to-image/blob/2e3b211ca431e0951b4a44537a93e0c837a1348f/src/util.ts
   */
  function htmlToDataUrl(
    html,
    width,
    height,
  ) {
    const xmlns = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(xmlns, 'svg')
    const foreignObject = document.createElementNS(xmlns, 'foreignObject')

    svg.setAttribute('width', `${width * devicePixelRatio}`)
    svg.setAttribute('height', `${height * devicePixelRatio}`)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    foreignObject.setAttribute('width', '100%')
    foreignObject.setAttribute('height', '100%')
    foreignObject.setAttribute('x', '0')
    foreignObject.setAttribute('y', '0')
    foreignObject.setAttribute('externalResourcesRequired', 'true')

    svg.appendChild(foreignObject)
    foreignObject.innerHTML = html;
    return svgToDataURL(svg);

    /**
     * @param {SVGElement} svg
     * @return {string}
     */
    function svgToDataURL(svg) {
      const html = new XMLSerializer().serializeToString(svg);
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(html)}`;
    }
  }
}
