<?php

// Activer l'affichage des erreurs pour t'aider à débugger (à retirer en production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 1. Inclusion des outils globaux et Base de données
require_once 'Database.php';
require_once 'Auth.php';

// 2. Inclusion des Modèles
require_once 'Plat.php';
require_once 'Contact.php';
require_once 'Reservation.php';

// 3. Inclusion des Contrôleurs
require_once 'Platcontroller.php';
require_once 'ContactController.php';
require_once 'ReservationController.php';

// 4. Inclusion du Routeur pour traiter l'URL
require_once 'router.php';