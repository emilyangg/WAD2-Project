<?php

// create & initialize a curl session
function call_api($url) {

    $curl = curl_init();
    
    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL,$url);
    
    // Set cURL Headers
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'AccessKey: 31d76d00-70aa-46bc-b5d0-5e025149ac5a',
      'Token: b65524j27s2gP0-7d970VsbGwX@8-nmax6cGa8B-00eztRduxdb5Ck95MW2XN1dP6daXgbd6nuUa4U0PSYZx-yb@z7BFmq9da6sZ',
    ));
    
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

    // Convert from JSON to associative array
    $out_assoc = json_decode($output, true);
    return $output;

}

// Google Map Nearby Carpark Places API
// Carpark Name, Address, Latitude and Longitude 
// eg. SMU Carpark, 50 Stamford Road, Lee Kong Chien School of Business, lat : 1.2953273 & lng : 103.8506022

// Input destination latitude and longitude 
$lat = "1.296568";
$long = "103.852119";
$coordinates = $lat . "," . $long;

// Specify URL
$gmNearby = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=". $coordinates . "&type=parking&key=AIzaSyDozDyfjIbBGMu-vpZfs2eDBUN8cnyUGyQ&rankby=distance";

// Call Google Map Nearby Carpark Places API
$gmNearby_response = call_api($gmNearby);

// Display Google Map Nearby Carpark Places
echo $gmNearby_response;

?>