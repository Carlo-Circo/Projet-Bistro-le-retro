<?php

// controllers/PlatController.php

class PlatController {

    private Plat $model;

    public function __construct() {
        $this->model = new Plat();
    }

    // ─── GET /api/plats ───────────────────────────────────────────────────
    // Params query optionnels : categorie, vegetarien, sans_gluten
    public function index(): void {
        $filters = [
            'categorie'   => $_GET['categorie']   ?? '',
            'vegetarien'  => $_GET['vegetarien']  ?? '',
            'sans_gluten' => $_GET['sans_gluten'] ?? '',
        ];

        // Validation de la catégorie si fournie
        $categoriesOk = ['entree', 'plat', 'dessert'];
        if ($filters['categorie'] !== '' && !in_array($filters['categorie'], $categoriesOk, true)) {
            respond(422, [
                'success' => false,
                'error'   => 'Catégorie invalide. Valeurs acceptées : ' . implode(', ', $categoriesOk),
            ]);
        }

        $plats = $this->model->findAll($filters);

        respond(200, [
            'success' => true,
            'count'   => count($plats),
            'data'    => $plats,
        ]);
    }

    // ─── GET /api/plats/{id} ──────────────────────────────────────────────
    public function show(int $id): void {
        $plat = $this->model->findById($id);

        if (!$plat) {
            respond(404, ['success' => false, 'error' => "Plat #$id introuvable."]);
        }

        respond(200, ['success' => true, 'data' => $plat]);
    }

    // ─── POST /api/plats ──────────────────────────────────────────────────
    public function store(): void {
        $body = $this->getBody();
        $errors = $this->validate($body);

        if ($errors) {
            respond(422, ['success' => false, 'errors' => $errors]);
        }

        $id = $this->model->create($body);
        $plat = $this->model->findById($id);

        respond(201, [
            'success' => true,
            'message' => 'Plat créé avec succès.',
            'data'    => $plat,
        ]);
    }

    // ─── PUT /api/plats/{id} ──────────────────────────────────────────────
    public function update(int $id): void {
        if (!$this->model->findById($id)) {
            respond(404, ['success' => false, 'error' => "Plat #$id introuvable."]);
        }

        $body   = $this->getBody();
        $errors = $this->validate($body);

        if ($errors) {
            respond(422, ['success' => false, 'errors' => $errors]);
        }

        $this->model->update($id, $body);

        respond(200, [
            'success' => true,
            'message' => 'Plat mis à jour.',
            'data'    => $this->model->findById($id),
        ]);
    }

    // ─── DELETE /api/plats/{id} ───────────────────────────────────────────
    public function destroy(int $id): void {
        if (!$this->model->findById($id)) {
            respond(404, ['success' => false, 'error' => "Plat #$id introuvable."]);
        }

        $this->model->delete($id);

        respond(200, [
            'success' => true,
            'message' => "Plat #$id supprimé.",
        ]);
    }

    // ─── Helpers privés ───────────────────────────────────────────────────

    private function getBody(): array {
        $raw = file_get_contents('php://input');
        return json_decode($raw, true) ?? [];
    }

    private function validate(array $data): array {
        $errors = [];
        $categoriesOk = ['entree', 'plat', 'dessert'];

        if (empty(trim($data['nom'] ?? ''))) {
            $errors['nom'] = 'Le nom est obligatoire.';
        } elseif (mb_strlen($data['nom']) > 100) {
            $errors['nom'] = 'Le nom ne doit pas dépasser 100 caractères.';
        }

        if (empty(trim($data['description'] ?? ''))) {
            $errors['description'] = 'La description est obligatoire.';
        }

        if (!isset($data['prix']) || !is_numeric($data['prix']) || $data['prix'] < 0) {
            $errors['prix'] = 'Le prix doit être un nombre positif.';
        }

        if (empty($data['categorie']) || !in_array($data['categorie'], $categoriesOk, true)) {
            $errors['categorie'] = 'Catégorie invalide. Valeurs : ' . implode(', ', $categoriesOk);
        }

        return $errors;
    }
}