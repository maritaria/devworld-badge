document.querySelectorAll('[js-tilt]').forEach(setupTiltByMouse);

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
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    element.style.setProperty('--pointer-x', `${percent.x.toFixed(1)}%`);
    element.style.setProperty('--pointer-y', `${percent.y.toFixed(1)}%`);
    element.style.setProperty('--rotate-x', `${(-center.x / 1.5).toFixed(1)}deg`);
    element.style.setProperty('--rotate-y', `${(center.y / 2).toFixed(1)}deg`);
    element.style.setProperty('--glare-opacity', '1');
    element.style.setProperty('--background-x', `${Math.remap(percent.x, 0, 100, 37, 63).toFixed(1)}%`);
    element.style.setProperty('--background-y', `${Math.remap(percent.y, 0, 100, 33, 67).toFixed(1)}%`);
  }

  function onMouseLeave() {
    element.style.removeProperty('--pointer-x');
    element.style.removeProperty('--pointer-y');
    element.style.removeProperty('--rotate-x');
    element.style.removeProperty('--rotate-y');
    element.style.removeProperty('--glare-opacity');
    element.style.removeProperty('--background-x');
    element.style.removeProperty('--background-y');
  }
}
