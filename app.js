(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shell = document.querySelector('.page-shell');

  document.documentElement.classList.add('has-motion');
  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  if (reducedMotion || !shell || !window.matchMedia('(pointer: fine)').matches) return;

  document.body.classList.add('mouse-active');
  const cursor = document.createElement('div');
  cursor.className = 'cursor-orbit';
  cursor.innerHTML = '<i></i><b></b>';
  document.body.append(cursor);

  let nextX = window.innerWidth / 2;
  let nextY = window.innerHeight / 2;
  let cursorX = nextX;
  let cursorY = nextY;
  let raf;

  const render = () => {
    cursorX += (nextX - cursorX) * 0.18;
    cursorY += (nextY - cursorY) * 0.18;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    const box = shell.getBoundingClientRect();
    const x = ((nextX - box.left) / box.width) * 100;
    const y = ((nextY - box.top) / box.height) * 100;
    shell.style.setProperty('--pointer-x', `${x}%`);
    shell.style.setProperty('--pointer-y', `${y}%`);
    shell.style.setProperty('--tilt-x', `${(y - 50) / -14}deg`);
    shell.style.setProperty('--tilt-y', `${(x - 50) / 18}deg`);
    raf = requestAnimationFrame(render);
  };

  window.addEventListener('pointermove', (event) => {
    nextX = event.clientX;
    nextY = event.clientY;
  }, { passive: true });

  document.querySelectorAll('a, button').forEach((target) => {
    target.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
    target.addEventListener('pointerleave', () => {
      cursor.classList.remove('is-hovering');
      target.style.transform = '';
    });
    target.addEventListener('pointermove', (event) => {
      const box = target.getBoundingClientRect();
      const x = (event.clientX - box.left - box.width / 2) * 0.13;
      const y = (event.clientY - box.top - box.height / 2) * 0.13;
      target.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  raf = requestAnimationFrame(render);
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
})();
