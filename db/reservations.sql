CREATE TABLE IF NOT EXISTS `reservations` ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nom VARCHAR(30) NOT NULL, 
    prenom VARCHAR(20) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    tel VARCHAR(20) NOT NULL UNIQUE, 
    date_resa DATETIME NOT NULL, 
    heure_resa TIME NOT NULL, 
    nb_personnes INT NOT NULL CHECK (nb_personnes BETWEEN 1 AND 12), 
    message TEXT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP );