<?php
require_once 'getURAnearest.php';

// Dummy Lat and Long (SMU LKCSB)
$lat = "1.2953";
$long = "103.8506";
$results = getNearestURACP($lat, $long);
var_dump($results);

// required headers
// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");

//Our own api endpoint


?>