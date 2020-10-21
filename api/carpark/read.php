<?php
require_once 'ura.php';

// $ura_details is a json, details_arr is an array of all the results
$url_details = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
$ura_details = call_ura_api($url_details);
$details_arr = $ura_details['Result'];
//var_dump($carpark_details);

// $ura_avails is a json, avails_arr is an array of all the results
$url_avails = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
$ura_avails = call_ura_api($url_avails);
$avails_arr = $ura_avails['Result'];
//var_dump($carpark_details);

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//Our own api endpoint


?>