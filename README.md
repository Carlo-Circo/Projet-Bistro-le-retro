# Bistrot Le Rétro — Projet Web

Projet réalisé dans le cadre de la formation à l'École IT.  
Site web d'un néobistrot lillois fictif avec une API PHP connectée à une base de données MySQL.

---

## Répartition du travail

| Partie | Responsable |
|---|---|
| Front-end (HTML, CSS, JavaScript) | Mannany et Carlo
| API PHP (controllers, models, router) | Mannany
| Base de données (tables SQL, seed) | Carlo

---

## Structure du projet

```
Projet-Bistro-le-retro/
├── index.html          # Page d'accueil
├── menu.html           # La carte (23 plats)
├── galerie.html        # Galerie photo avec lightbox
├── reservation.html    # Formulaire de réservation
├── contact.html        # Formulaire de contact
│
├── css/
│   └── style.css       # CSS Mobile-First + dark mode
│
├── js/
│   ├── nav.js          # Burger menu
│   ├── menu.js         # Chargement des plats via API + filtres
│   ├── galerie.js      # Filtres galerie + lightbox
│   ├── reservation.js  # Validation + envoi formulaire réservation
│   ├── contact.js      # Validation + envoi formulaire contact
│   └── theme.js        # Toggle dark / light mode
│
├── php/
│   ├── index.php           # Point d'entrée de l'API
│   ├── .htaccess           # Réécriture d'URL vers index.php
│   ├── router.php          # Routeur (dispatch des requêtes)
│   ├── database.php        # Connexion PDO (Singleton)
│   ├── Auth.php            # Vérification clé API (X-API-Key)
│   ├── Plat.php            # Model plats
│   ├── Reservation.php     # Model réservations
│   ├── Contact.php         # Model contacts
│   ├── PlatController.php          # CRUD plats
│   ├── ReservationController.php   # CRUD réservations
│   └── ContactController.php       # Enregistrement messages
│
└── img/                # Images des plats et du bistrot
```

---

## Base de données (réalisée par Carlo)

Fichiers SQL fournis :
- `plats.sql` — création de la table `plats`
- `reservations.sql` — création de la table `reservations`
- `contacts.sql` — création de la table `contacts`
- `seed.sql` — insertion des 23 plats

### Importer la base

1. Ouvrir **phpMyAdmin** → `http://localhost/phpmyadmin`
2. Créer une base de données : `bistrot_retro`
3. Importer les fichiers dans l'ordre :
   ```
   plats.sql → reservations.sql → contacts.sql → seed.sql
   ```

---

## Installation

### Prérequis
- XAMPP (Apache + MySQL + PHP 8.2+)

### Étapes

1. Copier le dossier dans `C:\xampp\htdocs\` :
   ```
   C:\xampp\htdocs\bistrot\
   ```

2. Importer la base de données (voir ci-dessus)

3. Configurer la connexion dans `php/database.php` :
   ```php
   private static string $dbname = 'bistrot_retro';
   private static string $user   = 'root';
   private static string $pass   = '';
   ```

4. Démarrer Apache et MySQL depuis le **XAMPP Control Panel**

5. Ouvrir le site :
   ```
   http://localhost/bistrot/
   ```

---

## API REST

Base URL : `http://localhost/bistrot/php/`

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/plats` | Liste tous les plats | Non |
| GET | `/plats?categorie=plat` | Filtre par catégorie | Non |
| GET | `/plats?vegetarien=1` | Filtre végétarien | Non |
| GET | `/plats/{id}` | Détail d'un plat | Non |
| POST | `/plats` | Créer un plat |  Oui |
| PUT | `/plats/{id}` | Modifier un plat |  Oui |
| DELETE | `/plats/{id}` | Supprimer un plat |  Oui |
| POST | `/reservations` | Nouvelle réservation | Non |
| GET | `/reservations` | Liste des réservations |  Oui |
| POST | `/contact` | Envoyer un message | Non |

### Authentification

Les routes protégées nécessitent le header :
```
X-API-Key: CHANGE_ME_32_CHARS_SECRET_KEY_HERE
```

---

## Fonctionnalités

- **Responsive** — Mobile-First, 3 breakpoints (mobile / tablette / desktop)
- **Dark mode** — Toggle lune/soleil, préférence mémorisée
- **Carte dynamique** — Chargement depuis l'API, filtres catégorie + végétarien + sans gluten
- **Galerie** — Filtres par thème + lightbox avec navigation clavier
- **Réservation** — Validation en temps réel, envoi vers l'API
- **Contact** — Formulaire avec validation, messages enregistrés en BDD
- **Accessibilité** — Balises ARIA, navigation clavier, attributs `alt` sur toutes les images

---

## Contexte

> Projet B1 Décalé — École IT  
> Année 2025-2026
