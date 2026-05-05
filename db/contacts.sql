CREATE TABLE IF NOT EXISTS contacts ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nom VARCHAR(20), 
    email VARCHAR(100), 
    message text, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP );