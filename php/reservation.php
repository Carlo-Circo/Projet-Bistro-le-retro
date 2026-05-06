<?php

// models/Reservation.php

class Reservation {

    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findAll(): array {
        $stmt = $this->db->query(
            'SELECT * FROM reservations ORDER BY date DESC, heure ASC'
        );
        return $stmt->fetchAll();
    }

    public function findById(int $id): array|false {
        $stmt = $this->db->prepare(
            'SELECT * FROM reservations WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            'INSERT INTO reservations
                (prenom, nom, email, telephone, date, heure, couverts, commentaire, statut)
             VALUES
                (:prenom, :nom, :email, :telephone, :date, :heure, :couverts, :commentaire, "en_attente")'
        );
        $stmt->execute([
            ':prenom'      => $data['prenom'],
            ':nom'         => $data['nom'],
            ':email'       => $data['email'],
            ':telephone'   => $data['telephone'],
            ':date'        => $data['date'],
            ':heure'       => $data['heure'],
            ':couverts'    => (int) $data['couverts'],
            ':commentaire' => $data['commentaire'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    // Mise à jour du statut uniquement (confirmer / annuler)
    public function updateStatut(int $id, string $statut): int {
        $allowed = ['en_attente', 'confirmee', 'annulee'];
        if (!in_array($statut, $allowed, true)) {
            return 0;
        }
        $stmt = $this->db->prepare(
            'UPDATE reservations SET statut = :statut WHERE id = :id'
        );
        $stmt->execute([':statut' => $statut, ':id' => $id]);
        return $stmt->rowCount();
    }

    public function delete(int $id): int {
        $stmt = $this->db->prepare('DELETE FROM reservations WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount();
    }
}