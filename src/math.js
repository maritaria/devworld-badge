Math.clamp = function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
Math.remap = function remap(value, fromMin, fromMax, toMin, toMax) {
  return toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin);
};
