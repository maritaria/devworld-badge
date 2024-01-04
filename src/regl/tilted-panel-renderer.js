import {elements, position, uv} from "../card.data.js";
import {mat4, quat} from "gl-matrix";

/**
 * @param {REGL.Regl} regl
 * @return {REGL.DrawCommand}
 */
export function makeTiltedPanelRenderer(regl) {
  return regl({
    elements,
    attributes: {
      position,
      uv,
    },
    uniforms: {
      view: ({tick}, props) => {
        const t = 0.01 * tick;
        return mat4.lookAt([],
          [0, 0, props.distance ?? 1],
          [0, 0, 0],
          [0, 1, 0]
        );
      },
      projection: ({viewportWidth, viewportHeight}) =>
        mat4.perspective([],
          Math.PI / 4,
          viewportWidth / viewportHeight,
          0.01,
          10),
      model: (context, props) => props.model ?? mat4.fromRotationTranslationScale(
        [],
        quat.fromEuler([], props.tilt?.x ?? 0, props.tilt?.y ?? 0, 0),
        [0, 0, 0],
        [props.scale?.x ?? 1, props.scale?.y ?? 1, 1],
      ),
      texture: regl.prop('texture'),
    },
    // language=GLSL
    vert: `
      precision mediump float;
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;
      uniform mat4 projection, view, model;
      void main() {
        vUv = uv;
        gl_Position = projection * view * model * vec4(position, 1);
      }
    `,
    // language=GLSL
    frag: `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D texture;
      void main () {
        gl_FragColor = texture2D(texture, vUv);
      }
    `,
  });
}
