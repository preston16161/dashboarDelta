CREATE DATABASE IF NOT EXISTS regiment_db;
USE regiment_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    rank VARCHAR(50) NOT NULL,
    division VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Actif',
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    participants TEXT NOT NULL,
    outcome TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'En cours',
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Create default admin user
INSERT INTO users (username, password, name, rank, division) 
VALUES ('admin', 'admin', 'Administrateur', 'Administrateur', 'Commandement');