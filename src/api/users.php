<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

include_once '../config/database.php';

// Get all users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT * FROM users WHERE username != 'admin'";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
}

// Create user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO users (username, password, name, rank, division, email, phone, status) 
              VALUES (:username, :password, :name, :rank, :division, :email, :phone, 'Actif')";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':username', $data->username);
    $stmt->bindParam(':password', $data->password);
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':rank', $data->rank);
    $stmt->bindParam(':division', $data->division);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':phone', $data->phone);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}

// Update user
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "UPDATE users SET 
              name = :name,
              rank = :rank,
              division = :division,
              email = :email,
              phone = :phone
              WHERE id = :id";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':rank', $data->rank);
    $stmt->bindParam(':division', $data->division);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':phone', $data->phone);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}

// Update status
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "UPDATE users SET status = :status WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':status', $data->status);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}