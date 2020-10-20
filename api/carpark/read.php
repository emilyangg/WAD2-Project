<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../objects/carpark.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

// initialize object
$carpark = new Carpark($db);

// query products
$stmt = $carpark->read();
$num = $stmt->rowCount();

// check if more than 0 record found
if($num > 0) {

    // products array
    $result_arr = array();
    $result_arr["records"] = array();

    while( $row = $stmt->fetch(PDO::FETCH_ASSOC) ) {
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);

        $item = array(
            "_id" => $id,
            "address" => $address,
            "car_park_no" => $car_park_no,
            "coordinates" => [
                "y_coord" => $y_coord,
                "x_coord" => $x_coord
            ],
            "parking_info" => [
                "short_term_parking" => $short_term_parking,
                "free_parking" => $free_parking,
                "night_parking" => $night_parking,
                "type_of_parking_system" => $type_of_parking_system
            ],
            "carpark_info" => [
                "car_park_type" => $car_park_type,
                "gantry_height" => $gantry_height,
                "car_park_basement" => $car_park_basement,
                "car_park_decks" => $car_park_decks
            ]
        );

        array_push($result_arr["records"], $item);
    }

    // Add info node (1 per response)
    $date = new DateTime(null, new DateTimeZone('Asia/Singapore'));
    $result_arr["info"] = array(
        "author" => "Krazy Woman",
        "response_datetime_singapore" => $date->format('Y-m-d H:i:sP')
    );

    // set response code - 200 OK
    http_response_code(200);

    // show products data in json format
    echo json_encode($result_arr);
}
else {
  
    // set response code - 404 Not found
    http_response_code(404);
  
    // tell the user no items found
    echo json_encode(
        array("message" => "No items found.")
    );
}
?>