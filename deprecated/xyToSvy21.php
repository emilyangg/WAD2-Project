<?php

// Convert lat and long to svy21 E & N
// Source: https://docs.onemap.sg/#4326-wgs84-to-3857

function convert_xy_to_svy21($lat, $long) {

    $curl = curl_init();
    $url = "https://developers.onemap.sg/commonapi/convert/4326to3414?latitude=". $lat . "&longitude=" . $long;
  
    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL, $url);
    
    // return the transfer as a string, also with setopt()
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    // To prevent Curl error: SSL certificate problem: unable to get local issuer certificate
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

    // curl_exec() executes the started curl session
    // $output contains the output string
    $output = curl_exec($curl);

    // close curl resource to free up system resources
    // (deletes the variable made by curl_init)
    curl_close($curl);

    $out_assoc = json_decode($output, true);

    // var_dump($out_assoc);
    
    return $out_assoc;

}

// $lat = "1.2953";
// $long ="103.8506";
// convert_xy_to_svy21($lat, $long);

?>