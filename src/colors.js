export function colorToRgba(name) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.fillStyle = name;
  context.fillRect(0, 0, 1, 1);
  return context.getImageData(0, 0, 1, 1).data;
}

export function rgbToHex(r, g, b) {
  return rgbaToHex(r, g, b);
}

export function rgbaToHex(r, g, b, a) {
  const parts = [r, g, b];
  if (a != undefined && a !== 0xFF) {
    parts.push(a);
  }

  const hex = parts.map(c => c.toString(16).padStart(2, '0')).join('');
  return '#' + hex;
}

export function colorToHex(name) {
  const rgba = colorToRgba(name);
  return rgbaToHex(...rgba);
}
