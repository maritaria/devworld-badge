document.querySelectorAll('.tiltable').forEach(setupTiltByMouse);

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
      x: Math.clamp(Math.round((100 / rect.width) * absolute.x), 0, 100),
      y: Math.clamp(Math.round((100 / rect.height) * absolute.y), 0, 100),
    };
    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    element.style.setProperty('--pointer-x', `${percent.x}%`);
    element.style.setProperty('--pointer-y', `${percent.y}%`);
    element.style.setProperty('--rotate-x', `${Math.round(-center.x / 1.5)}deg`);
    element.style.setProperty('--rotate-y', `${Math.round(center.y / 2)}deg`);
  }

  function onMouseLeave() {
    element.style.removeProperty('--pointer-x');
    element.style.removeProperty('--pointer-y');
    element.style.removeProperty('--rotate-x');
    element.style.removeProperty('--rotate-y');
  }
}
