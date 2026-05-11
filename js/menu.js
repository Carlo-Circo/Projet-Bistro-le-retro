/* menu.js — Chargement dynamique depuis GET /api/plats + filtres */
(function () {
  'use strict';

  const API_URL = '/Projet-Bistrot/php/plats.php';
  const grid     = document.getElementById('menu-grid');
  const countEl  = document.getElementById('dish-count');
  const catBtns  = document.querySelectorAll('.filter-btn[data-category]');
  const dietBoxes= document.querySelectorAll('input[data-diet]');

  let allCards       = [];   // garde tous les articles du DOM
  let activeCategory = 'all';
  let activeDiets    = new Set();

  // ─── Chargement initial ──────────────────────────────────────────────
  async function loadPlats() {
    // Si la grille est vide, on affiche un message de chargement.
    // Sinon, on la laisse telle quelle pour l'instant pour éviter le "flicker".
    if (grid.children.length === 0) {
      grid.innerHTML = '<p style="text-align:center;padding:2rem;opacity:.6;">Chargement de la carte…</p>';
    }

    try {
      const res  = await fetch(API_URL);
      if (!res.ok) throw new Error('Erreur serveur ' + res.status);
      const json = await res.json();

      const fragment = document.createDocumentFragment();
      const newCards = [];
      json.data.forEach(function (plat) {
        const article = buildCard(plat);
        fragment.appendChild(article);
        newCards.push(article);
      });
      grid.innerHTML = '';
      grid.appendChild(fragment);
      allCards = newCards;

      updateCount();

    } catch (err) {
      console.error(err);
      if (grid.children.length === 0) {
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
      updateCount(grid.querySelectorAll('.dish-card').length);
    }
  }

  // ─── Gestionnaire de secours pour les images manquantes (ULTRA ROBUSTE) ──────────────
  window.fallbackImage = function(img, slug) {
    let attempt = parseInt(img.dataset.attempt || '0');
    attempt++;
    img.dataset.attempt = attempt.toString();

    // On récupère le chemin exact de l'image sans son extension
    let currentSrc = img.src.split('?')[0];
    let dotIndex = currentSrc.lastIndexOf('.');
    if (dotIndex === -1) dotIndex = currentSrc.length;
    let basePath = currentSrc.substring(0, dotIndex);

    // On teste toutes les extensions possibles de manière totalement automatique !
    if (attempt === 1) img.src = basePath + '.jpg';
    else if (attempt === 2) img.src = basePath + '.jpeg';
    else if (attempt === 3) img.src = basePath + '.png';
    else if (attempt === 4) img.src = basePath + '.webp';
    else {
      img.onerror = null;
      img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTQ5NWE1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjM2ZW0iPlBob3RvIG1hbnF1YW50ZTwvdGV4dD48L3N2Zz4=';
    }
  };

  // ─── Construction d'une carte plat ───────────────────────────────────
  function buildCard(plat) {
    const article = document.createElement('article');
    article.className = 'dish-card';
    article.dataset.category   = plat.categorie;
    article.dataset.vegetarien = plat.vegetarien  ? 'true' : 'false';
    article.dataset.sansGluten = plat.sans_gluten ? 'true' : 'false';

    // Image : nom de fichier déduit du slug du plat
    const imgSlug = slugify(plat.nom);
    
    // Dictionnaire pour les plats qui ont un nom complètement différent
    const imagesPersonnalisees = {
      'waterzoi': 'waterzoi.jpeg',
      'carbonnade-flamande': 'carbo.jpeg', // OK
      'tarte-au-maroilles': 'tarte.webp',
      'soupe-a-l-oignon-gratinee': 'soupe-oignons.webp',
      'potjevleesch': 'potjevleesch.webp', // OK
      'flamiche-aux-poireaux': 'flamiche-aux-poireaux.webp',
      'salade-de-chicons-au-lard': 'salade-de-chicons.webp',
      'croquettes-aux-crevettes-grises': 'croquettes-crevettes.webp',
      'soupe-de-legumes-du-terroir': 'soupe-de-legumes.webp',
      'oeufs-mimosa-a-la-biere-blonde': 'oeufs-mimosa.webp',
      'lapin-a-la-gueuze': 'lapin_a_la_gueuze.png', // OK
      'joues-de-porc-au-genievre': 'joues-de-porc.png',
      'moules-frites-mariniere': 'moules-frites.png',
      'hochepot-flamand': 'hochepot.png', // OK
      'filet-de-cabillaud-au-beurre-blanc': 'filet_de_cabillaud.png', // OK
      'ficelles-picardes': 'ficelles-liegoise.png', // Nom exact de ton fichier
      'poulet-a-la-flamande': 'poulet-braise.png',
      'gaufres-de-liege': 'gaufres-liegoises.png',
      'tarte-au-sucre': 'tarte_au_sucre.png', // OK
      'creme-brulee-a-la-chicoree': 'creme-brulee.png',
      'cramique-perdu': 'cramique_perdu.png',
      'mousse-au-chocolat-belge': 'mousse_au_chocolat.png',
      'speculoos-maison-et-glace-vanille': 'speculoos_glace.png'
    };

    // L'encodage URI cause souvent des soucis avec Apache/Windows pour les espaces et accents.
    // On utilise directement le nom exact !
    let nomImage = imagesPersonnalisees[imgSlug] ? imagesPersonnalisees[imgSlug] : `${imgSlug}.webp`;
    let imgSrc = `img/${nomImage}`;

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
           onerror="window.fallbackImage(this, '${imgSlug}')"
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
      .replace(/œ/g, 'oe')
      .replace(/æ/g, 'ae')
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