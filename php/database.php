<?php

// config/database.php

class Database {

    private static ?PDO $instance = null;

    // ─── Paramètres de connexion ───────────────────────────────────────
    // Modifie ces valeurs ou passe par des variables d'environnement
    private static string $host   = 'localhost';
    private static string $dbname = 'bistro_retro';
    private static string $user   = 'root';
    private static string $pass   = '';
    private static string $charset = 'utf8mb4';

    // Empêche l'instanciation directe
    private function __construct() {}

    /**
     * Retourne la connexion PDO (Singleton)
     */
    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=%s',
                self::$host,
                self::$dbname,
                self::$charset
            );
            try {
                self::$instance = new PDO($dsn, self::$user, self::$pass, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]);
            } catch (PDOException $e) {
                http_response_code(503);
                echo json_encode([
                    'success' => false,
                    'error'   => 'Connexion à la base de données impossible.',
                ]);
                exit;
            }
        }
        return self::$instance;
    }
}