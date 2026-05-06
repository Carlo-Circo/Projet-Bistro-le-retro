/* galerie.js — Filtres galerie + Lightbox */
(function () {
  'use strict';

  /* ---- FILTRES ---- */
  const items    = document.querySelectorAll('.galerie-item');
  const filterBtns = document.querySelectorAll('.filter-btn[data-galerie]');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cat = btn.dataset.galerie;
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      items.forEach(function (item) {
        const match = cat === 'all' || item.dataset.galerie === cat;
        item.style.display = match ? '' : 'none';
        item.setAttribute('aria-hidden', String(!match));
      });
    });
  });

  /* ---- LIGHTBOX ---- */
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightbox-img');
  const lbCaption   = document.getElementById('lightbox-caption');
  const lbClose     = document.getElementById('lightbox-close');
  const lbPrev      = document.getElementById('lightbox-prev');
  const lbNext      = document.getElementById('lightbox-next');

  if (!lightbox) return;

  let currentIndex = 0;
  let visibleItems = [];

  function getVisibleItems() {
    return Array.from(items).filter(function (item) {
      return item.style.display !== 'none';
    });
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    lbImg.src     = item.dataset.src || item.querySelector('img').src;
    lbImg.alt     = item.querySelector('img').alt;
    lbCaption.textContent = item.dataset.caption || '';
    lbPrev.style.display = currentIndex > 0 ? '' : 'none';
    lbNext.style.display = currentIndex < visibleItems.length - 1 ? '' : 'none';
  }

  function navigate(direction) {
    currentIndex += direction;
    currentIndex = Math.max(0, Math.min(currentIndex, visibleItems.length - 1));
    updateLightboxContent();
  }

  // Ouvrir la lightbox au clic / Entrée
  items.forEach(function (item, i) {
    item.addEventListener('click', function () {
      visibleItems = getVisibleItems();
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        visibleItems = getVisibleItems();
        const idx = visibleItems.indexOf(item);
        if (idx !== -1) openLightbox(idx);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  function () { navigate(-1); });
  lbNext.addEventListener('click',  function () { navigate(1);  });

  // Fermer en cliquant sur le fond
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Navigation clavier
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();