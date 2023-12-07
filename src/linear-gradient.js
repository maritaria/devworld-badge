import {Vec2} from "./Vec2.js";
import {toRadians} from "./math.js";

export function linearGradientLength(width, height, angle) {
  const box = new Vec2(width, height);
  const diagonal = box.length;
  const beta = box.angle;
  const theta = angle - beta;
  const slope = Math.sin(toRadians(theta));
  const length = slope * diagonal;
  return Math.abs(length);
}
