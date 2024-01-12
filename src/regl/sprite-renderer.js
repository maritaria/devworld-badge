/**
 * @param {REGL.Regl} regl
 */
export function makeSpriteRenderer(regl) {
  const compiled = regl({
    elements: [[2, 1, 0], [2, 0, 3]],
    attributes: {
      vertexPosition: [
        [0, +1], [+1, +1], [+1, 0], [0, 0],
      ],
    },
    uniforms: {
      sprite: regl.prop('sprite'),
      spriteBox: regl.prop('spriteBox'),
      screen: (context) => [context.drawingBufferWidth, context.drawingBufferHeight],
    },
    // language=GLSL
    vert: `
      precision mediump float;
      uniform vec4 spriteBox;
      uniform vec2 screen;
      attribute vec2 vertexPosition;
      varying vec2 uv;

      void main() {
        uv = vertexPosition;
        vec2 spritePos = spriteBox.xy / screen * 2.0 - 1.0;
        vec2 spriteSize = spriteBox.zw / screen * 2.0;
        gl_Position = vec4(spritePos + vertexPosition * spriteSize, 0, 1);
        gl_Position.y *= -1.0;
      }
    `,
    // language=GLSL
    frag: `
      precision mediump float;
      uniform sampler2D sprite;
      varying vec2 uv;

      void main() {
        gl_FragColor = texture2D(sprite, uv);
      }
    `,
  });

  return function renderSprites(sprite, position, size) {
    compiled({
      sprite,
      spriteBox: [...position, ...size],
    })
  }
}
