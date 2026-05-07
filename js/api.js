/* js/api.js - Désactivé */
console.log("Fichier api.js désactivé pour éviter les conflits avec menu.js");

/* =========================================================
   FONCTIONS POUR LA PAGE MENU
   ========================================================= */
async function chargerMenu() {
    try {
        const reponse = await fetch('/projet-bistro/Projet-Bistro-le-retro/php/plats');
        const resultat = await reponse.json();

        if (resultat.success) {
            const menuGrid = document.querySelector('.menu-grid');
            menuGrid.innerHTML = ''; // Vider le conteneur

            resultat.data.forEach(plat => {
                const prixFormatte = parseFloat(plat.prix).toFixed(2);
                const tagVege = plat.vegetarien === 1 ? '<span class="tag tag-vege">Végétarien</span>' : '';
                const tagGluten = plat.sans_gluten === 1 ? '<span class="tag tag-gluten">Sans gluten</span>' : '';

                // Création du lien de l'image basé sur le nom du plat (ex: img/entree-soupe-a-l-oignon.webp)
                const slug = plat.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                const imgSrc = `img/${plat.categorie}-${slug}.webp`;

                // Création de la carte HTML du plat
                const platHTML = `
                    <div class="dish-card" data-categorie="${plat.categorie}" data-vege="${plat.vegetarien}" data-gluten="${plat.sans_gluten}">
                        <img src="${imgSrc}" alt="${plat.nom}" onerror="this.onerror=null; this.src='img/placeholder.webp';" loading="lazy">
                        <h3>${plat.nom}</h3>
                        <p>${plat.description}</p>
                        <div class="dish-footer">
                            <span class="dish-price">${prixFormatte} €</span>
                            <div class="dish-tags">${tagVege} ${tagGluten}</div>
                        </div>
                    </div>
                `;
                menuGrid.innerHTML += platHTML;
            });

            initFiltresMenu(); // Activer les boutons de tri
        }
    } catch (erreur) {
        console.error("Erreur de chargement du menu :", erreur);
    }
}

function initFiltresMenu() {
    const btnCategories = document.querySelectorAll('.filter-btn');
    const chkVege = document.querySelector('input[name="filter-vege"]');
    const chkGluten = document.querySelector('input[name="filter-gluten"]');

    function appliquerFiltres() {
        const btnActif = document.querySelector('.filter-btn.active');
        const categorieSelect = btnActif ? btnActif.dataset.category : 'all';
        const veutVege = chkVege ? chkVege.checked : false;
        const veutGluten = chkGluten ? chkGluten.checked : false;

        document.querySelectorAll('.dish-card').forEach(card => {
            let afficher = true;
            if (categorieSelect !== 'all' && card.dataset.categorie !== categorieSelect) afficher = false;
            if (veutVege && card.dataset.vege !== '1') afficher = false;
            if (veutGluten && card.dataset.gluten !== '1') afficher = false;
            
            card.classList.toggle('hidden', !afficher); // Utilise ta classe CSS .hidden
        });
    }

    btnCategories.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btnCategories.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            appliquerFiltres();
        });
    });

    if (chkVege) chkVege.addEventListener('change', appliquerFiltres);
    if (chkGluten) chkGluten.addEventListener('change', appliquerFiltres);
}

/* =========================================================
   FONCTIONS POUR LA PAGE RÉSERVATION & CONTACT
   ========================================================= */
async function gererEnvoiFormulaire(e, urlAPI, formClassContainer) {
    e.preventDefault();
    const form = e.target;
    
    // Convertir les champs du formulaire en objet { nom: "...", email: "..." }
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const reponse = await fetch(urlAPI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resultat = await reponse.json();

        if (reponse.ok && resultat.success) {
            form.reset(); // Vider le formulaire
            alert("Envoyé avec succès !"); // Tu pourras remplacer par ton propre affichage stylisé
        } else if (resultat.errors) {
            let messagesErreur = "Veuillez corriger :\n";
            Object.values(resultat.errors).forEach(msg => messagesErreur += `- ${msg}\n`);
            alert(messagesErreur);
        }
    } catch (erreur) {
        console.error(erreur);
        alert("Erreur de connexion avec le serveur.");
    }
}

function gererReservation(e) {
    gererEnvoiFormulaire(e, '/projet-bistro/Projet-Bistro-le-retro/php/reservations');
}

function gererContact(e) {
    gererEnvoiFormulaire(e, '/projet-bistro/Projet-Bistro-le-retro/php/contact');
}