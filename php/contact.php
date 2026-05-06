<?php

// models/Contact.php

class Contact {

    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare(
            'INSERT INTO messages_contact (nom, email, sujet, message)
             VALUES (:nom, :email, :sujet, :message)'
        );
        $stmt->execute([
            ':nom'     => $data['nom'],
            ':email'   => $data['email'],
            ':sujet'   => $data['sujet'],
            ':message' => $data['message'],
        ]);
        return (int) $this->db->lastInsertId();
    }
}