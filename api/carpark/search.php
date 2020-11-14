<?php
require_once 'getURAnearest.php';
require_once 'getHDBnearest.php';

// // SMU
// $lat = 1.2953;
// $lng = 103.8506;

// Receive destination latitude and longitude using get from client
$lat = isset($_GET["lat"]) ? $_GET["lat"] : "";
$lng = isset($_GET["lng"]) ? $_GET["lng"] : "";
$results = [];

if ($lat == "" || $lng == "") {
    http_response_code(404);

    // tell the user no items found
    echo json_encode(
        array("message" => "Invalid Destination Supplied")
    );
} else {

    $results["HDB"] = getNearestHDBCP($lat, $lng);
    $results["URA"] =  getNearestURACP($lat, $lng);
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

    // // required headers
    // // header("Access-Control-Allow-Origin: *");
    // // header("Content-Type: application/json; charset=UTF-8");
}
?>