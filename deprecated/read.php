<?php
require_once 'ura.php';

$url_details = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
$ura_details = call_ura_api($url_details);
// var_dump($ura_details);

$url_avails = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
$ura_avails = call_ura_api($url_avails);
//var_dump($ura_avails);

$result_arr = [];
$result_arr["records"] = [];
for($i=3; $i<count($ura_details); $i++) {
    $item = [];
    $item[1];
}

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//Our own api endpoint


?>