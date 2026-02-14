<?php
    ini_set('display_errors', 1);
    ini_set('max_execution_time', 1000);
    //header('Content-Type: application/json');
	
	include 'user.php';
	
	$conn = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, 'if0_36019408_creations');
	
	$id = $users_row['id'];
	$main_parts_array;
	
	$parts_stmt = $conn->prepare("SELECT * FROM parts WHERE userid = ?");
    $parts_stmt->bind_param("s", $id);
    $parts_stmt->execute();
	$parts = $parts_stmt->get_result();
	//$parts_arr = $parts->fetch_assoc();
	
	while ($row = $parts->fetch_assoc()) {
		$main_parts_array[] = $row;
	}
	
	//echo json_encode(array($parts . ' ' . $id));
	echo json_encode($main_parts_array);
	exit;
?>