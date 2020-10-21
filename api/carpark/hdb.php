<?php

// Execute cURL API Call
function callAPI($method, $url, $data){
    $curl = curl_init();
    switch ($method){
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);			 					
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }
   // OPTIONS:
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'APIKEY: 111111111111111111111',
        'Content-Type: application/json',
    ));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

    // EXECUTE:
    $result = curl_exec($curl);
    if(!$result){die("Connection Failure");}
    curl_close($curl);
    return $result;
}


// HDB Information
// Carpark Number, x and y coordinates (E and N), address, free parking 
// eg. BR21, 34387.1259 & 30595.5166, Blk 41 Jalan Bahagia, SUN & PH FR 7AM-10.30PM
$hbd_information = callAPI('GET', 'https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c', false);
$hbd_information_response = json_decode($hbd_information, true);

// HDB Carpark Availability
// Carpark Number, Total Lots, Lot Type, Lots Availability 
// eg. HE12, 91, C, 0
$hdb_cp_avail = callAPI('GET', 'https://api.data.gov.sg/v1/transport/carpark-availability', false);
$hbd_cp_avail_response = json_decode($hdb_cp_avail, true);

// Display HDB Information & HDB Carpark Availability
echo $hbd_information;
echo $hdb_cp_avail;

?>