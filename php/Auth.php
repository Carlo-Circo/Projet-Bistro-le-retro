<?php

// middleware/Auth.php

class Auth {

    // ─── Clé API attendue ─────────────────────────────────────────────────
    // En production, utilise une variable d'environnement :
    //   private static string $apiKey = $_ENV['API_KEY'] ?? '';
    private static string $apiKey = 'bistrot-retro-secret-2026';

    /**
     * Vérifie la présence et la validité de la clé API.
     * Répond 401 et stoppe l'exécution si la clé est absente ou incorrecte.
     */
    public static function check(): bool {
        $headers = getallheaders();

        // Lecture dans X-API-Key ou Authorization: Bearer <clé>
        $key = $headers['X-API-Key']
            ?? $headers['x-api-key']
            ?? null;

        if ($key === null && isset($headers['Authorization'])) {
            $auth = $headers['Authorization'];
            if (str_starts_with($auth, 'Bearer ')) {
                $key = substr($auth, 7);
            }
        }

        if ($key === null || !hash_equals(self::$apiKey, $key)) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'error'   => 'Clé API manquante ou invalide.',
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        return true;
    }
}