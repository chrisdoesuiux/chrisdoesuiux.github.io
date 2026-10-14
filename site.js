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
