<?php

// models/Reservation.php

class Reservation {

    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findAll(): array {
        $stmt = $this->db->query(
            'SELECT * FROM reservations ORDER BY date_resa DESC, heure_resa ASC'
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
                (nom, prenom, email, tel, date_resa, heure_resa, nb_personnes, message)
             VALUES
                (:nom, :prenom, :email, :tel, :date_resa, :heure_resa, :nb_personnes, :message)'
        );
        $stmt->execute([
            ':nom'          => $data['nom'],
            ':prenom'       => $data['prenom'],
            ':email'        => $data['email'],
            ':tel'          => $data['tel'],
            ':date_resa'    => $data['date_resa'],
            ':heure_resa'   => $data['heure_resa'],
            ':nb_personnes' => (int) $data['nb_personnes'],
            ':message'      => $data['message'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): int {
        $stmt = $this->db->prepare(
            'UPDATE reservations
             SET nom = :nom, prenom = :prenom, email = :email, tel = :tel,
                 date_resa = :date_resa, heure_resa = :heure_resa,
                 nb_personnes = :nb_personnes, message = :message
             WHERE id = :id'
        );
        $stmt->execute([
            ':id'           => $id,
            ':nom'          => $data['nom'],
            ':prenom'       => $data['prenom'],
            ':email'        => $data['email'],
            ':tel'          => $data['tel'],
            ':date_resa'    => $data['date_resa'],
            ':heure_resa'   => $data['heure_resa'],
            ':nb_personnes' => (int) $data['nb_personnes'],
            ':message'      => $data['message'] ?? null,
        ]);
        return $stmt->rowCount();
    }

    public function delete(int $id): int {
        $stmt = $this->db->prepare('DELETE FROM reservations WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount();
    }
}