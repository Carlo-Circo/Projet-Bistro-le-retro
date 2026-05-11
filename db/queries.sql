-- commande pour tous les plats végétariens entrée + plat

SELECT * FROM plats
WHERE vegetarien = TRUE
AND categorie IN ('entree', 'plat');

-- commande pour les réservations à venir cette semaine

SELECT nom, prenom, email, tel, date_resa, heure_resa, nb_personnes, message
FROM reservations
WHERE YEARWEEK(date_resa, 1) = YEARWEEK(CURDATE(), 1)
  AND date_resa >= CURDATE()
ORDER BY date_resa, heure_resa;

-- commande pour le nombre de reservation par jour

SELECT DATE(date_resa) AS jour, COUNT(*) AS nb_reservations
FROM reservations
GROUP BY DATE(date_resa)
ORDER BY jour;