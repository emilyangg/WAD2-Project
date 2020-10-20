<?php
// create & initialize a curl session
function call_api($url) {
    $curl = curl_init();

    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL,$url );

    // return the transfer as a string, also with setopt()
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    // curl_exec() executes the started curl session
    // $output contains the output string
    $output = curl_exec($curl);

    // close curl resource to free up system resources
    // (deletes the variable made by curl_init)
    curl_close($curl);

    $out_assoc = json_decode($output);

    return $output;

}

$url = "http://localhost/midterm/api/winner/read.php";

echo call_api($url)


?>