/* menu.js — Filtres de la carte */
(function () {
  'use strict';

  const cards        = document.querySelectorAll('.dish-card');
  const catBtns      = document.querySelectorAll('.filter-btn[data-category]');
  const dietBoxes    = document.querySelectorAll('input[data-diet]');
  const countEl      = document.getElementById('dish-count');

  if (!cards.length) return;

  let activeCategory = 'all';
  let activeDiets    = new Set();

  function applyFilters() {
    let visible = 0;

    cards.forEach(function (card) {
      const matchCat  = activeCategory === 'all' || card.dataset.category === activeCategory;

      let matchDiet = true;
      activeDiets.forEach(function (diet) {
        if (diet === 'vegetarien'  && card.dataset.vegetarien  !== 'true') matchDiet = false;
        if (diet === 'sans-gluten' && card.dataset.sansGluten  !== 'true') matchDiet = false;
      });

      if (matchCat && matchDiet) {
        card.classList.remove('hidden');
        card.removeAttribute('aria-hidden');
        visible++;
      } else {
        card.classList.add('hidden');
        card.setAttribute('aria-hidden', 'true');
      }
    });

    if (countEl) countEl.textContent = visible;
  }

  // Boutons catégorie
  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      catBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      applyFilters();
    });
  });

  // Checkboxes régime
  dietBoxes.forEach(function (box) {
    box.addEventListener('change', function () {
      if (box.checked) {
        activeDiets.add(box.dataset.diet);
      } else {
        activeDiets.delete(box.dataset.diet);
      }
      applyFilters();
    });
  });

  // Init
  applyFilters();
})();