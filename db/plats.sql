CREATE TABLE IF NOT EXISTS plats ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nom VARCHAR(30) NOT NULL, 
    description text NOT NULL, 
    prix INT NOT NULL, 
    categorie VARCHAR(20) NOT NULL, 
    vegetarien BOOLEAN, 
    sans_gluten BOOLEAN);
