<?php

// models/Contact.php

class Contact {

    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            'INSERT INTO contacts (nom, email, message) VALUES (:nom, :email, :message)'
        );
        $stmt->execute([
            ':nom'     => $data['nom'],
            ':email'   => $data['email'],
            ':message' => $data['message'],
        ]);
        return (int) $this->db->lastInsertId();
    }
}