(() => {
  'use strict';
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const darkPreference = window.matchMedia('(prefers-color-scheme: dark)');
  root.classList.add('js');
  let theme;
  try { theme = localStorage.getItem('chris-portfolio-theme'); } catch {}
  if (theme === 'light' || theme === 'dark') root.dataset.theme = theme;
  const effectiveDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : darkPreference.matches;
  function updateThemeButton() {
    document.querySelectorAll('.theme-toggle').forEach(button => {
      const isDark = effectiveDark();
      button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
      button.title = button.getAttribute('aria-label');
      button.querySelector('.icon').className = `icon icon-${isDark ? 'sun' : 'moon'}`;
      button.hidden = false;
    });
  }
  updateThemeButton();
  darkPreference.addEventListener('change', updateThemeButton);
  document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
    root.dataset.theme = effectiveDark() ? 'light' : 'dark';
    try { localStorage.setItem('chris-portfolio-theme', root.dataset.theme); } catch {}
    updateThemeButton();
  }));
  const revealNodes = document.querySelectorAll('.reveal');
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    revealNodes.forEach(node => observer.observe(node));
  } else revealNodes.forEach(node => node.classList.add('is-visible'));

  const badgeScene = document.querySelector('.badge-scene');
  if (badgeScene) {
    const assembly = badgeScene.querySelector('.badge-assembly');
    const front = badgeScene.querySelector('.badge-front');
    const back = badgeScene.querySelector('.badge-back');
    const returnButton = badgeScene.querySelector('.badge-return');
    const hint = badgeScene.querySelector('.badge-hint');
    front.setAttribute('aria-describedby', 'badge-hint badge-keyboard-hint');
    let angle = -5, velocity = 0, frame = 0, lastFrame = 0;
    let pointer = null, suppressClick = false, flipped = false;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const paint = () => assembly.style.setProperty('--swing', `${angle.toFixed(3)}deg`);
    // A fixed-step damped pendulum. Stop requesting frames once it settles.
    const animate = time => {
      if (reduceMotion.matches || document.hidden) { frame = 0; lastFrame = 0; return; }
      const steps = lastFrame ? clamp((time - lastFrame) / 16.667, .25, 2) : 1;
      lastFrame = time;
      velocity += (-angle * .018 - velocity * .095) * steps;
      angle = clamp(angle + velocity * steps, -28, 28);
      paint();
      if (Math.abs(angle) + Math.abs(velocity) > .035) frame = requestAnimationFrame(animate);
      else { angle = 0; velocity = 0; paint(); frame = 0; lastFrame = 0; }
    };
    const swing = impulse => {
      if (reduceMotion.matches) return;
      velocity = clamp(velocity + impulse, -4, 4);
      if (!frame) { lastFrame = 0; frame = requestAnimationFrame(animate); }
    };
    const flip = next => {
      flipped = next;
      badgeScene.classList.toggle('is-flipped', flipped);
      front.inert = flipped;
      front.setAttribute('aria-hidden', String(flipped));
      front.setAttribute('aria-expanded', String(flipped));
      back.inert = !flipped;
      back.setAttribute('aria-hidden', String(!flipped));
      hint.textContent = flipped ? 'A little more about me.' : 'Drag to swing. Click to flip.';
      (flipped ? returnButton : front).focus({ preventScroll:true });
      swing(flipped ? .7 : -.7);
    };
    front.addEventListener('click', event => {
      if (suppressClick && event.detail !== 0) { suppressClick = false; return; }
      flip(true);
    });
    returnButton.addEventListener('click', () => flip(false));
    front.addEventListener('pointerdown', event => {
      if (event.button !== 0 || reduceMotion.matches) return;
      cancelAnimationFrame(frame); frame = 0;
      const rect = badgeScene.getBoundingClientRect();
      pointer = { id:event.pointerId, x:event.clientX, y:event.clientY, angle,
        pivotX:rect.left + rect.width / 2, pivotY:rect.top + 12,
        time:event.timeStamp, moved:false };
      velocity = 0;
      suppressClick = false;
      front.setPointerCapture(event.pointerId);
    });
    front.addEventListener('pointermove', event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
      if (Math.hypot(dx, dy) > 6) pointer.moved = true;
      if (!pointer.moved) return;
      badgeScene.classList.add('is-dragging');
      const start = Math.atan2(pointer.x - pointer.pivotX, Math.max(60, pointer.y - pointer.pivotY));
      const current = Math.atan2(event.clientX - pointer.pivotX, Math.max(60, event.clientY - pointer.pivotY));
      const next = clamp(pointer.angle - (current - start) * 180 / Math.PI, -28, 28);
      velocity = clamp((next - angle) * 16.667 / Math.max(8, event.timeStamp - pointer.time), -4, 4);
      angle = next;
      pointer.time = event.timeStamp;
      paint();
    });
    const release = event => {
      if (!pointer || pointer.id !== event.pointerId) return;
      suppressClick = pointer.moved;
      if (event.timeStamp - pointer.time > 90) velocity = 0;
      pointer = null;
      badgeScene.classList.remove('is-dragging');
      if (front.hasPointerCapture(event.pointerId)) front.releasePointerCapture(event.pointerId);
      swing(0);
    };
    front.addEventListener('pointerup', release);
    front.addEventListener('pointercancel', release);
    front.addEventListener('lostpointercapture', release);
    badgeScene.addEventListener('keydown', event => {
      if (event.key === 'Escape' && flipped) { event.preventDefault(); flip(false); }
      if (event.target === front && ['ArrowLeft','ArrowRight'].includes(event.key)) {
        event.preventDefault(); swing(event.key === 'ArrowLeft' ? 2 : -2);
      }
    });
    const surface = badgeScene.querySelector('.badge-tilt');
    const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)');
    surface.addEventListener('pointermove', event => {
      if (!finePointer.matches || reduceMotion.matches || pointer) return;
      const face = flipped ? back : front;
      const bounds = face.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
      const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1);
      // Set each face independently: the back is rotated, so inherited X would mirror.
      face.style.setProperty('--light-x', `${(x * 100).toFixed(2)}%`);
      face.style.setProperty('--light-y', `${(y * 100).toFixed(2)}%`);
    });
    const resetMotion = () => {
      cancelAnimationFrame(frame); frame = 0; lastFrame = 0;
      pointer = null; angle = 0; velocity = 0;
      badgeScene.classList.remove('is-dragging'); paint();
    };
    reduceMotion.addEventListener('change', resetMotion);
    document.addEventListener('visibilitychange', () => { if (document.hidden) resetMotion(); });
    swing(0);
  }

  const chapters = document.querySelectorAll('.chapter-nav a');
  if (chapters.length && 'IntersectionObserver' in window) {
    const active = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? active.add(entry.target.id) : active.delete(entry.target.id));
      const link = Array.from(chapters).find(item => active.has(item.hash.slice(1)));
      if (link) chapters.forEach(item => item === link ? item.setAttribute('aria-current','location') : item.removeAttribute('aria-current'));
    },{rootMargin:'-5% 0px -55% 0px',threshold:0});
    chapters.forEach(link => {const section = document.querySelector(link.hash);if(section) observer.observe(section);});
  }
  const prototypeFrame = document.getElementById('ai-search-frame');
  const restartPrototype = document.getElementById('ai-search-reset');
  if (prototypeFrame && restartPrototype) {
    const prototypeInitialUrl = new URL(prototypeFrame.getAttribute('src'), document.baseURI);
    restartPrototype.addEventListener('click', () => {
      const restartUrl = new URL(prototypeInitialUrl);
      restartUrl.searchParams.set('restart', Date.now().toString());
      prototypeFrame.src = restartUrl.href;
    });
  }
  const dialog = document.querySelector('.image-dialog');
  if (dialog) {
    let returnFocus, previousOverflow;
    const close = () => dialog.close();
    document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
      const image = document.getElementById('dialog-image');
      image.src = button.dataset.image; image.alt = button.querySelector('img').alt;
      document.getElementById('dialog-caption').textContent = button.dataset.caption;
      returnFocus = button; previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden'; dialog.showModal();
      dialog.querySelector('.dialog-image-scroll').scrollTo(0,0);
      dialog.querySelector('.dialog-close').focus();
    }));
    dialog.querySelector('.dialog-close').addEventListener('click',close);
    dialog.addEventListener('click',event => {if(event.target === dialog) close();});
    dialog.addEventListener('close', () => {document.body.style.overflow = previousOverflow || '';returnFocus?.focus({preventScroll:true});});
  }
})();
