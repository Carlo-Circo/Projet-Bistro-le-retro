CREATE TABLE IF NOT EXISTS plats ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nom VARCHAR(100) NOT NULL, 
    description text NOT NULL, 
    prix DECIMAL(10, 2) NOT NULL, 
    categorie ENUM('entree', 'plat', 'dessert') NOT NULL, 
    vegetarien BOOLEAN, 
    sans_gluten BOOLEAN);
