/* nav.js — Burger menu commun à toutes les pages */
(function () {
  'use strict';

  const burger = document.querySelector('.burger-menu');
  const nav    = document.querySelector('.main-nav');

  if (!burger || !nav) return;

  burger.addEventListener('click', function () {
    const isOpen = nav.classList.toggle('is-active');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Fermer le menu si on clique à l'extérieur
  document.addEventListener('click', function (e) {
    if (!burger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('is-active');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Fermer le menu sur Échap
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-active')) {
      nav.classList.remove('is-active');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });
})();