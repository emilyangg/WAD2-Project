<?php
require_once './ura.php';
require_once './xyToSvy21.php';
require_once 'getURAnearest.php';

// $ura_details is a json, details_arr is an array of all the results
$url_details = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
$ura_details = call_ura_api($url_details);
$details_arr = $ura_details['Result'];

// $ura_avails is a json, avails_arr is an array of all the results
$url_avails = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
$ura_avails = call_ura_api($url_avails);
$avails_arr = $ura_avails['Result'];
// var_dump($avails_arr);

// Given Lat and Long (SMU LKCSB)
$lat = "1.2953";
$long = "103.8506";

// Convert Lat and Long to SVY21 format
$EastNorth = convert_xy_to_svy21($lat, $long);
// var_dump($EastNorth);
$easting = $EastNorth['X'];
$northing = $EastNorth['Y'];

$nearbyCarpark = nearbyCP($avails_arr,$easting,$northing,1000);
var_dump($nearbyCarpark);

// required headers
// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");

//Our own api endpoint


?>