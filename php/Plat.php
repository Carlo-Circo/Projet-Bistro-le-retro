<?php

// models/Plat.php

class Plat {

    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    // ─── Récupère tous les plats avec filtres optionnels ─────────────────
    public function findAll(array $filters = []): array {
        $where  = [];
        $params = [];

        if (!empty($filters['categorie'])) {
            $where[]              = 'categorie = :categorie';
            $params[':categorie'] = $filters['categorie'];
        }

        if (isset($filters['vegetarien']) && $filters['vegetarien'] !== '') {
            $where[]               = 'vegetarien = :vegetarien';
            $params[':vegetarien'] = (int) $filters['vegetarien'];
        }

        if (isset($filters['sans_gluten']) && $filters['sans_gluten'] !== '') {
            $where[]                = 'sans_gluten = :sans_gluten';
            $params[':sans_gluten'] = (int) $filters['sans_gluten'];
        }

        $sql = 'SELECT * FROM plats';
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY categorie, nom';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    // ─── Récupère un plat par son ID ─────────────────────────────────────
    public function findById(int $id): array|false {
        $stmt = $this->db->prepare(
            'SELECT * FROM plats WHERE id = :id'
        );
        $stmt->execute([':id' => $id]);
        return $stmt->fetch();
    }

    // ─── Crée un nouveau plat ─────────────────────────────────────────────
    public function create(array $data): int {
        $stmt = $this->db->prepare(
            'INSERT INTO plats (nom, description, prix, categorie, vegetarien, sans_gluten)
             VALUES (:nom, :description, :prix, :categorie, :vegetarien, :sans_gluten)'
        );
        $stmt->execute([
            ':nom'         => $data['nom'],
            ':description' => $data['description'],
            ':prix'        => $data['prix'],
            ':categorie'   => $data['categorie'],
            ':vegetarien'  => (int) ($data['vegetarien'] ?? 0),
            ':sans_gluten' => (int) ($data['sans_gluten'] ?? 0),
        ]);
        return (int) $this->db->lastInsertId();
    }

    // ─── Met à jour un plat ───────────────────────────────────────────────
    public function update(int $id, array $data): int {
        $stmt = $this->db->prepare(
            'UPDATE plats
             SET nom = :nom, description = :description, prix = :prix,
                 categorie = :categorie, vegetarien = :vegetarien, sans_gluten = :sans_gluten
             WHERE id = :id'
        );
        $stmt->execute([
            ':id'          => $id,
            ':nom'         => $data['nom'],
            ':description' => $data['description'],
            ':prix'        => $data['prix'],
            ':categorie'   => $data['categorie'],
            ':vegetarien'  => (int) ($data['vegetarien'] ?? 0),
            ':sans_gluten' => (int) ($data['sans_gluten'] ?? 0),
        ]);
        return $stmt->rowCount();
    }

    // ─── Supprime un plat ─────────────────────────────────────────────────
    public function delete(int $id): int {
        $stmt = $this->db->prepare('DELETE FROM plats WHERE id = :id');
        $stmt->execute([':id' => $id]);
        return $stmt->rowCount();
    }
}