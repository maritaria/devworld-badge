/** @param {HTMLElement} element */
function setupTiltByMouse(element) {
  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  /** @param {MouseEvent} event*/
  function onMouseMove(event) {
    const rect = element.getBoundingClientRect();
    const absolute = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const percent = {
      x: Math.clamp((100 / rect.width) * absolute.x, 0, 100),
      y: Math.clamp((100 / rect.height) * absolute.y, 0, 100),
    };
    applyTilt(element, percent);
  }

  function onMouseLeave() {
    applyTilt(element, null);
  }
}

function applyTilt(element, percent) {
  if (percent) {
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };
    const centerDistance = Math.sqrt((center.x ** 2) + center.y ** 2);
    element.style.setProperty('--pointer-x', `${percent.x.toFixed(1)}%`);
    element.style.setProperty('--pointer-y', `${percent.y.toFixed(1)}%`);
    element.style.setProperty('--pointer-from-center', `${Math.clamp(centerDistance/50, 0, 1).toFixed(2)}`)
    element.style.setProperty('--pointer-from-top', `${Math.clamp(percent.y / 100, 0, 1).toFixed(2)}`);
    element.style.setProperty('--pointer-from-left', `${Math.clamp(percent.x / 100, 0, 1).toFixed(2)}`);
    element.style.setProperty('--rotate-x', `${(-center.x / 1.5).toFixed(1)}deg`);
    element.style.setProperty('--rotate-y', `${(center.y / 2).toFixed(1)}deg`);
    element.style.setProperty('--glare-opacity', '1');
    element.style.setProperty('--background-x', `${Math.remap(percent.x, 0, 100, 37, 63).toFixed(1)}%`);
    element.style.setProperty('--background-y', `${Math.remap(percent.y, 0, 100, 33, 67).toFixed(1)}%`);
  } else {
    element.style.removeProperty('--pointer-x');
    element.style.removeProperty('--pointer-y');
    element.style.removeProperty('--pointer-from-center');
    element.style.removeProperty('--pointer-from-top');
    element.style.removeProperty('--pointer-from-left');
    element.style.removeProperty('--rotate-x');
    element.style.removeProperty('--rotate-y');
    element.style.removeProperty('--glare-opacity');
    element.style.removeProperty('--background-x');
    element.style.removeProperty('--background-y');
  }
}
