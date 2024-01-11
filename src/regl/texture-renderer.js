/**
 * @param {REGL.Regl} regl
 * @returns {REGL.DrawCommand<REGL.DefaultContext, {texture: REGL.Texture2D}>}
 */
export function makeTextureRenderer(regl) {
  return regl({
    count: 3,
    attributes: {
      position: [[1, 1], [-3, 1], [1, -3]],
    },
    uniforms: {
      texture: regl.prop('texture'),
    },
    // language=GLSL
    vert: `
      precision highp float;
      attribute vec2 position;
      varying vec2 uv;
      void main() {
        gl_Position = vec4(position, 0, 1);
        uv = position;
      }
    `,
    // language=GLSL
    frag: `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D texture;

      void main() {
        // Flip Y, remap [-1..1] to [0..1]
        vec2 uv = uv * vec2(1, -1) / 2.0 + 0.5;
        // Sample the texture
        gl_FragColor = texture2D(texture, uv);
      }
    `,
  });
}
