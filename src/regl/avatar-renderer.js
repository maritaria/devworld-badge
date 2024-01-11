import {Vec2} from "../Vec2.js";

/**
 * @param {REGL.Regl} regl
 * @return {function(
 *   texture: REGL.Texture2D,
 *   radius: number,
 *   center?: {x:number,y:number}|[x:number,y:number]
 * ): void}
 */
export function makeAvatarRenderer(regl) {
  const compiled = regl({
    count: 3,
    attributes: {
      position: [[1, 1], [-3, 1], [1, -3]],
    },
    uniforms: {
      texture: regl.prop('texture'),
      textureSize: (_, props) => [props.texture.width, props.texture.height],
      screen: (context) => [context.drawingBufferWidth, context.drawingBufferHeight],
      center: (context, props) => props.center ? Vec2.coerceArgs(props.center).toArray() : [context.drawingBufferWidth / 2, context.drawingBufferHeight / 2],
      radius: (context, props) => props.radius ?? Math.min(context.drawingBufferWidth, context.drawingBufferHeight) / 2,
    },
    depth: {
      enable: false,
    },
    blend: {
      enable: true,
      func: {src: 'src alpha', dst: 'one minus src alpha'},
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
      uniform vec2 textureSize;
      uniform vec2 screen;
      uniform vec2 center;
      uniform float radius;

      void main() {
        // Flip Y, remap [-1..1] to [0..1]
        vec2 uv = uv * vec2(1, -1) / 2.0 + 0.5;
        // Map viewport uv to pixel coordinate
        vec2 pixel = uv * screen;
        // Map pixel coordinate to destination delta
        vec2 pxDelta = pixel - center;
        vec2 outSize = vec2(radius * 2.0);
        vec2 ratioAdjust = min(textureSize.yx / textureSize.xy, 1.0);
        // Map pxDelta to texture UV space, adjust for ratio as well
        vec2 textureUV = pxDelta / outSize * ratioAdjust + 0.5;
        // Sample the texture
        gl_FragColor = texture2D(texture, textureUV);
        // Cut out the circle pattern using SDF
        float circleDistance = radius - length(pxDelta);
        gl_FragColor *= clamp(circleDistance, 0.0, 1.0);
      }
    `,
  });
  return function renderAvatar(texture, radius, center) {
    return compiled({
      texture,
      radius,
      center,
    })
  }
}
