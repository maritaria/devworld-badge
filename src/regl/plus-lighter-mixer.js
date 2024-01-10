/**
 * @param {REGL.Regl} regl
 * @return {(function(*, *): void)|*}
 */
export function makePlusLighterMixer(regl) {
  const compiled = regl({
    count: 3,
    attributes: {
      position: [[1, 1], [-3, 1], [1, -3]],
    },
    uniforms: {
      background: regl.prop('background'),
      foreground: regl.prop('foreground'),
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
      uniform sampler2D background;
      uniform sampler2D foreground;

      // @see https://drafts.fxtf.org/compositing/#porterduffcompositingoperators_plus_lighter
      vec4 mixPlusLighter(vec4 backdrop, vec4 source) {
        // Definitions:
        // Cs: is the source color
        // Cb: is the backdrop color
        // αs: is the source alpha
        // αb: is the backdrop alpha
        // B(Cb, Cs): is the mixing function
        // Fa: is defined by the Porter Duff operator in use
        // Fb: is defined by the Porter Duff operator in use
        
        // Fa = 1; Fb = 1
        // co = min(1, αs x Cs + αb x Cb);
        // αo = min(1, αs + αb);
        vec3 cs = source.rgb;
        vec3 cb = backdrop.rgb;
        float as = source.a;
        float ab = backdrop.a;

        // Blend: Cs = (1 - αb) x Cs + αb x B(Cb, Cs)
        // Composite: Co = αs x Fa x Cs + αb x Fb x Cb
        // Alpha: αo = αs + αb x (1 - αs)
        float ao = min(1.0, as + ab);
        vec3 co = min(vec3(1.0), as * cs + ab * cb);

        return vec4(co.rgb, ao);
      }

      void main() {
        // Flip Y, remap [-1..1] to [0..1]
        vec2 uv = uv * vec2(1, -1) / 2.0 + 0.5;

        vec4 bg = texture2D(background, uv);
        vec4 fg = texture2D(foreground, uv);

        // Sample the texture
        gl_FragColor = mixPlusLighter(bg, fg);
      }
    `,
  });

  return function mixPlusLighter(foreground, background) {
    compiled({background, foreground});
  }
}
