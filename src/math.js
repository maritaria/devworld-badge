export function round(number, decimals = 5) {
  return parseFloat(number.toFixed(decimals));
}

export function toDegrees(radians) {
  return wrap(radians * 180 / Math.PI, 360);
}

export function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

export function wrap(value, min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  const range = max - min;
  const offset = value - min;
  const wrapped = ((offset % range) + range) % range;
  return min + wrapped;
}
