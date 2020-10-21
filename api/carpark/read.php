<?php
require_once 'getURAnearest.php';

// Dummy Lat and Long (SMU LKCSB)
// $lat = "1.2953";
// $long = "103.8506";
$lat = isset($_GET["lat"]) ? $_GET["lat"] : "";
$lng = isset($_GET["lng"]) ? $_GET["lng"] : "";
$results = getNearestURACP($lat, $lng);
// var_dump($results);

if (count($results) > 0) {
    // set response code - 200 OK
    http_response_code(200);

    // show products data
    echo json_encode($results);
} 
else {
    // set response code - 404 Not found
    http_response_code(404);

    // tell the user no items found
    echo json_encode(
        array("message" => "No items found.")
    );
}

// required headers
// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");

//Our own api endpoint


?>