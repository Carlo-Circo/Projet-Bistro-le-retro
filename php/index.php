<?php

// index.php — Point d'entrée unique

declare(strict_types=1);

// ─── En-têtes CORS & JSON ──────────────────────────────────────────────────
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key');

// Réponse immédiate aux pré-vols OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── Autoload manuel ──────────────────────────────────────────────────────
spl_autoload_register(function (string $class): void {
    $dirs = [
        __DIR__ . '/config/',
        __DIR__ . '/models/',
        __DIR__ . '/controllers/',
        __DIR__ . '/middleware/',
    ];
    foreach ($dirs as $dir) {
        $file = $dir . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// ─── Gestion globale des exceptions non capturées ─────────────────────────
set_exception_handler(function (Throwable $e): void {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'Erreur interne du serveur.',
        'detail'  => $e->getMessage(), // Retirer en production
    ]);
});

// ─── Chargement du routeur ────────────────────────────────────────────────
require_once __DIR__ . '/routes/router.php';