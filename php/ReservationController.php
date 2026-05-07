<?php

// controllers/ReservationController.php

class ReservationController {

    private Reservation $model;

    public function __construct() {
        $this->model = new Reservation();
    }

    public function index(): void {
        $reservations = $this->model->findAll();
        respond(200, ['success' => true, 'data' => $reservations]);
    }

    public function show(int $id): void {
        $reservation = $this->model->findById($id);
        if (!$reservation) {
            respond(404, ['success' => false, 'error' => "Réservation introuvable."]);
        }
        respond(200, ['success' => true, 'data' => $reservation]);
    }

    public function store(): void {
        $raw = file_get_contents('php://input');
        $body = json_decode($raw, true) ?? [];

        $errors = [];
        if (empty(trim($body['prenom'] ?? ''))) $errors['prenom'] = 'Le prénom est requis.';
        if (empty(trim($body['nom'] ?? ''))) $errors['nom'] = 'Le nom est requis.';
        if (empty(trim($body['email'] ?? '')) || !filter_var($body['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'L\'email est invalide.';
        if (empty(trim($body['date_resa'] ?? ''))) $errors['date_resa'] = 'La date est requise.';
        if (empty(trim($body['heure_resa'] ?? ''))) $errors['heure_resa'] = 'L\'heure est requise.';
        if (empty($body['nb_personnes'])) $errors['nb_personnes'] = 'Le nombre de personnes est requis.';

        if ($errors) {
            respond(422, ['success' => false, 'errors' => $errors]);
        }

        // On mappe les clés envoyées par JS vers les clés attendues par ton modèle Reservation.php
        $data = [
            'prenom'      => $body['prenom'],
            'nom'         => $body['nom'],
            'email'       => $body['email'],
            'telephone'   => $body['tel'] ?? '',
            'date'        => $body['date_resa'],
            'heure'       => $body['heure_resa'],
            'couverts'    => $body['nb_personnes'],
            'commentaire' => $body['message'] ?? null,
        ];

        $id = $this->model->create($data);

        respond(201, [
            'success' => true,
            'message' => 'Réservation enregistrée avec succès.',
            'data'    => $this->model->findById($id),
        ]);
    }

    public function update(int $id): void {
        // À implémenter si tu souhaites gérer la modification de réservations via le back-office.
        // Exemple : utiliser $this->model->updateStatut($id, $body['statut']);
        respond(200, ['success' => true, 'message' => "Réservation mise à jour."]);
    }

    public function destroy(int $id): void {
        if (!$this->model->findById($id)) {
            respond(404, ['success' => false, 'error' => "Réservation introuvable."]);
        }
        $this->model->delete($id);
        respond(200, ['success' => true, 'message' => "Réservation supprimée."]);
    }
}