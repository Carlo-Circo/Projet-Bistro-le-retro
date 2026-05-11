<?php
// php/plats.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../models/Database.php';
require_once __DIR__ . '/../models/Plat.php';

try {
    $platModel = new Plat();

    $filters = [];
    if (!empty($_GET['categorie']))   $filters['categorie']   = $_GET['categorie'];
    if (isset($_GET['vegetarien']))   $filters['vegetarien']  = $_GET['vegetarien'];
    if (isset($_GET['sans_gluten']))  $filters['sans_gluten'] = $_GET['sans_gluten'];

    $plats = $platModel->findAll($filters);

    echo json_encode([
        'success' => true,
        'data'    => $plats
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Erreur serveur : ' . $e->getMessage()
    ]);
}