<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include_once '../api/carpark/hdb.php';
// include_once '../api/carpark/ura.php';
include_once './ura.php';

// $carpark_availability = call_ura_api("carpark availability");
$carpark_details = call_ura_api("carpark details");

// products array
// $carpark_details_arr = json_decode(json_encode($carpark_details), true);
$result_arr = array();
$result_arr["records"] = array();
echo gettype($carpark_details);
var_dump($carpark_details);

// foreach( $carpark_details_arr as $arr) {
//     $items = [];
//     foreach($arr as $key => $value) {
//         $items[$key] = $value;
//     }
//     // extract row
//     // this will make $row['name'] to
//     // just $name only
//     // extract($row);

//     // $item = array(
//     //     "_id" => $id,
//     //     "address" => $address,
//     //     "car_park_no" => $car_park_no,
//     //     "coordinates" => [
//     //         "y_coord" => $y_coord,
//     //         "x_coord" => $x_coord
//     //     ],
//     //     "parking_info" => [
//     //         "short_term_parking" => $short_term_parking,
//     //         "free_parking" => $free_parking,
//     //         "night_parking" => $night_parking,
//     //         "type_of_parking_system" => $type_of_parking_system
//     //     ],
//     //     "carpark_info" => [
//     //         "car_park_type" => $car_park_type,
//     //         "gantry_height" => $gantry_height,
//     //         "car_park_basement" => $car_park_basement,
//     //         "car_park_decks" => $car_park_decks
//     //     ]
//     // );

//     array_push($result_arr["records"], $item);
// }

// // // Add info node (1 per response)
// // $date = new DateTime(null, new DateTimeZone('Asia/Singapore'));
// // $result_arr["info"] = array(
// //     "author" => "Team",
// //     "response_datetime_singapore" => $date->format('Y-m-d H:i:sP')
// // );

// // // // set response code - 200 OK
// // // http_response_code(200);

// // // show products data in json format
// // var_dump($result_arr);
?>