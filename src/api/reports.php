<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET,POST,DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods,Authorization,X-Requested-With');

include_once '../config/database.php';

// Get all reports
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT r.*, u.name as author_name FROM reports r 
              JOIN users u ON r.author_id = u.id 
              ORDER BY r.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($reports);
}

// Create report
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $query = "INSERT INTO reports (type, title, description, participants, outcome, priority, author_id) 
              VALUES (:type, :title, :description, :participants, :outcome, :priority, :author_id)";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':type', $data->type);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':description', $data->description);
    $stmt->bindParam(':participants', $data->participants);
    $stmt->bindParam(':outcome', $data->outcome);
    $stmt->bindParam(':priority', $data->priority);
    $stmt->bindParam(':author_id', $data->author_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}

// Delete report (admin only)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->admin) || $data->admin !== true) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }
    
    $query = "DELETE FROM reports WHERE id = :id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':id', $data->id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}