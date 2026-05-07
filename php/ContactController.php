<?php

// controllers/ContactController.php

class ContactController {

    private Contact $model;

    public function __construct() {
        $this->model = new Contact();
    }

    public function store(): void {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];

        $errors = [];
        if (empty(trim($body['nom'] ?? ''))) $errors['nom'] = 'Le nom est obligatoire.';
        if (empty(trim($body['email'] ?? '')) || !filter_var($body['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'L\'email est invalide.';
        if (empty(trim($body['message'] ?? '')) || mb_strlen($body['message']) < 10) $errors['message'] = 'Le message doit contenir au moins 10 caractères.';

        if ($errors) {
            respond(422, ['success' => false, 'errors' => $errors]);
        }

        $this->model->create($body);

        respond(201, [
            'success' => true,
            'message' => 'Message envoyé avec succès.'
        ]);
    }
}