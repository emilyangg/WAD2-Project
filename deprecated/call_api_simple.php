<?php
// create & initialize a curl session
function call_api($url) {
    $curl = curl_init();

    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL,$url );

    // return the transfer as a string, also with setopt()
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    // To prevent Curl error: SSL certificate problem: unable to get local issuer certificate
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

    // curl_exec() executes the started curl session
    // $output contains the output string
    $output = curl_exec($curl);
    

    if(curl_exec($curl) === false)
    {
        echo 'Curl error: ' . curl_error($curl);
    }
    else
    {
        echo 'Operation completed without any errors';
    }

    // close curl resource to free up system resources
    // (deletes the variable made by curl_init)
    curl_close($curl);

    // $out_assoc = json_decode($output);

    return $output;

}

//$url = "http://localhost/midterm/api/winner/read.php";
$url = 'https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&q=jones';

echo call_api($url)


?>