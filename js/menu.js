/* menu.js — Chargement dynamique depuis GET /api/plats + filtres */
(function () {
  'use strict';

  const API_URL  = 'php/index.php/api/plats';
  const grid     = document.getElementById('menu-grid');
  const countEl  = document.getElementById('dish-count');
  const catBtns  = document.querySelectorAll('.filter-btn[data-category]');
  const dietBoxes= document.querySelectorAll('input[data-diet]');

  let allCards       = [];   // garde tous les articles du DOM
  let activeCategory = 'all';
  let activeDiets    = new Set();

  // ─── Chargement initial ──────────────────────────────────────────────
  async function loadPlats() {
    const hasStaticMenu = grid.querySelector('.dish-card') !== null;
    if (!hasStaticMenu) {
      grid.innerHTML = '<p style="text-align:center;padding:2rem;opacity:.6;">Chargement de la carte…</p>';
    }

    try {
      const res  = await fetch(API_URL);
      if (!res.ok) throw new Error('Erreur serveur ' + res.status);
      const json = await res.json();

      grid.innerHTML = '';
      allCards = [];

      json.data.forEach(function (plat) {
        const article = buildCard(plat);
        grid.appendChild(article);
        allCards.push(article);
      });

      updateCount();

    } catch (err) {
      console.error(err);
      if (!hasStaticMenu) {
        grid.innerHTML = `
          <p style="text-align:center;padding:2rem;color:#c0392b;">
            Impossible de charger la carte. Veuillez réessayer.
          </p>`;
      } else {
        const warning = document.createElement('p');
        warning.style.cssText = 'text-align:center;padding:1rem;color:#c0392b;';
        warning.textContent = 'Impossible de charger la carte depuis le serveur. Le menu statique est affiché.';
        grid.parentNode.insertBefore(warning, grid);
      }
      updateCount();
    }
  }

  // ─── Construction d'une carte plat ───────────────────────────────────
  function buildCard(plat) {
    const article = document.createElement('article');
    article.className = 'dish-card';
    article.dataset.category   = plat.categorie;
    article.dataset.vegetarien = plat.vegetarien  ? 'true' : 'false';
    article.dataset.sansGluten = plat.sans_gluten ? 'true' : 'false';

    // Image : nom de fichier déduit du slug du plat
    const imgSlug = slugify(plat.nom);
    const imgSrc  = `img/${plat.categorie}-${imgSlug}.webp`;

    // Tags
    let tags = '';
    if (plat.vegetarien)  tags += '<span class="tag tag-vege">Végé</span>';
    if (plat.sans_gluten) tags += '<span class="tag tag-gluten">SG</span>';

    // Prix formaté FR
    const prix = parseFloat(plat.prix).toLocaleString('fr-FR', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    }) + ' €';

    article.innerHTML = `
      <img src="${imgSrc}"
           alt="${escHtml(plat.nom)}"
           onerror="this.src='img/placeholder.webp'"
           loading="lazy">
      <h3>${escHtml(plat.nom)}</h3>
      <p>${escHtml(plat.description)}</p>
      <div class="dish-footer">
        <span class="dish-price">${prix}</span>
        <div class="dish-tags">${tags}</div>
      </div>`;

    return article;
  }

  // ─── Filtres ─────────────────────────────────────────────────────────
  function applyFilters() {
    let visible = 0;
    allCards.forEach(function (card) {
      const matchCat = activeCategory === 'all' || card.dataset.category === activeCategory;

      let matchDiet = true;
      if (activeDiets.has('vegetarien')  && card.dataset.vegetarien  !== 'true') matchDiet = false;
      if (activeDiets.has('sans-gluten') && card.dataset.sansGluten  !== 'true') matchDiet = false;

      const show = matchCat && matchDiet;
      card.classList.toggle('hidden', !show);
      card.setAttribute('aria-hidden', String(!show));
      if (show) visible++;
    });
    updateCount(visible);
  }

  function updateCount(n) {
    if (countEl) countEl.textContent = n ?? allCards.length;
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
      box.checked ? activeDiets.add(box.dataset.diet) : activeDiets.delete(box.dataset.diet);
      applyFilters();
    });
  });

  // ─── Utilitaires ─────────────────────────────────────────────────────
  function slugify(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─── Init ─────────────────────────────────────────────────────────────
  loadPlats();
})();