/* theme.js — Toggle dark / light mode */
(function () {
  'use strict';

  const btn  = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Applique le thème sauvegardé ou la préférence système
  const saved    = localStorage.getItem('theme');
  const prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme    = saved ?? (prefDark ? 'dark' : 'light');

  applyTheme(theme);

  btn?.addEventListener('click', function () {
    const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    if (btn) btn.textContent = t === 'dark' ? '☀️' : '🌙';
  }
})();