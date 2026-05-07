<?php

// routes/router.php

// ─── Lecture de l'URI et de la méthode ───────────────────────────────────
$requestUri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Si le point d'entrée est index.php/api/plats, on garde seulement la partie après index.php
if (($pos = strrpos($requestUri, '/index.php')) !== false) {
    $requestUri = substr($requestUri, $pos + strlen('/index.php'));
}

// Retire le préfixe /api si le dossier s'appelle "api"
$basePath = '/api';
if (str_starts_with($requestUri, $basePath)) {
    $requestUri = substr($requestUri, strlen($basePath));
}

// Normalisation : retire le slash final sauf pour "/"
$requestUri = rtrim($requestUri, '/') ?: '/';

// ─── Découpe l'URI en segments ────────────────────────────────────────────
// Ex : /plats/3  →  ['plats', '3']
$segments = array_values(array_filter(explode('/', $requestUri)));

$resource = $segments[0] ?? '';          // plats | reservations | contact
$id       = isset($segments[1]) ? (int) $segments[1] : null;

// ─── Dispatch ─────────────────────────────────────────────────────────────
switch ($resource) {

    // ── GET /api/plats
    // ── GET /api/plats?categorie=plat&vegetarien=1&sans_gluten=1
    // ── GET /api/plats/{id}
    // ── POST   /api/plats          (protégé)
    // ── PUT    /api/plats/{id}     (protégé)
    // ── DELETE /api/plats/{id}     (protégé)
    case 'plats':
        $ctrl = new PlatController();
        match (true) {
            $requestMethod === 'GET'    && $id === null => $ctrl->index(),
            $requestMethod === 'GET'    && $id !== null => $ctrl->show($id),
            $requestMethod === 'POST'   && $id === null => (Auth::check() && $ctrl->store()),
            $requestMethod === 'PUT'    && $id !== null => (Auth::check() && $ctrl->update($id)),
            $requestMethod === 'DELETE' && $id !== null => (Auth::check() && $ctrl->destroy($id)),
            default => respond(405, ['error' => 'Méthode non autorisée.']),
        };
        break;

    // ── GET  /api/reservations         (protégé)
    // ── GET  /api/reservations/{id}    (protégé)
    // ── POST /api/reservations         (public — formulaire front)
    // ── PUT  /api/reservations/{id}    (protégé)
    // ── DELETE /api/reservations/{id}  (protégé)
    case 'reservations':
        $ctrl = new ReservationController();
        match (true) {
            $requestMethod === 'GET'    && $id === null => (Auth::check() && $ctrl->index()),
            $requestMethod === 'GET'    && $id !== null => (Auth::check() && $ctrl->show($id)),
            $requestMethod === 'POST'   && $id === null => $ctrl->store(),
            $requestMethod === 'PUT'    && $id !== null => (Auth::check() && $ctrl->update($id)),
            $requestMethod === 'DELETE' && $id !== null => (Auth::check() && $ctrl->destroy($id)),
            default => respond(405, ['error' => 'Méthode non autorisée.']),
        };
        break;

    // ── POST /api/contact   (public — formulaire front)
    case 'contact':
        $ctrl = new ContactController();
        match ($requestMethod) {
            'POST'  => $ctrl->store(),
            default => respond(405, ['error' => 'Méthode non autorisée.']),
        };
        break;

    // ── GET /api/
    case '':
        respond(200, [
            'success' => true,
            'message' => 'API Bistrot Le Rétro v1.0',
            'routes'  => [
                'GET    /api/plats',
                'GET    /api/plats/{id}',
                'POST   /api/plats          (clé API requise)',
                'PUT    /api/plats/{id}     (clé API requise)',
                'DELETE /api/plats/{id}     (clé API requise)',
                'POST   /api/reservations',
                'GET    /api/reservations   (clé API requise)',
                'GET    /api/reservations/{id} (clé API requise)',
                'PUT    /api/reservations/{id} (clé API requise)',
                'DELETE /api/reservations/{id} (clé API requise)',
                'POST   /api/contact',
            ],
        ]);
        break;

    default:
        respond(404, ['error' => 'Route introuvable.']);
}

// ─── Helper global de réponse JSON ────────────────────────────────────────
function respond(int $code, array $data): void {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}