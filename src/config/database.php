<?php
// Remplacez ces valeurs par celles fournies par OuiHeberg
define('DB_HOST', 'mysql4.ouiheberg.com');  // Serveur MySQL fourni par OuiHeberg
define('DB_USER', 'votre_utilisateur');     // Nom d'utilisateur MySQL
define('DB_PASS', 'votre_mot_de_passe');    // Mot de passe MySQL
define('DB_NAME', 'votre_base');            // Nom de la base de données

try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    die();
}
?>