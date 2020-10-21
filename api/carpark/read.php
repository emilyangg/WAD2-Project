<?php
require_once 'ura.php';

$url_details = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
$ura_details = call_ura_api($url_details);
//var_dump($carpark_details);

$url_avails = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
$ura_avails = call_ura_api($url_avails);
//var_dump($carpark_details);

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//Our own api endpoint


?>