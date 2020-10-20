<?php

// create & initialize a curl session
$curl = curl_init();

// URL to send the request to
curl_setopt($curl, CURLOPT_URL, "http://jsonplaceholder.typicode.com/users");

// Return the transfer as a string
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

// Executes the started curl session
// $json_output contains the JSON objects
$json_output = curl_exec($curl);

// Check for errors
if ($error = curl_error($curl)){
  echo $error;
} else {

  // Displaying raw JSON output
  // print_r($json_output);

  // json_decode true sets the output to an array
  $json_decoded = json_decode($json_output, true);
  // var_dump($json_decoded);

  foreach($json_decoded as $decoded_item){
    echo $decoded_item['name'];
    echo "<br>";
  }
}

// close curl resource to free up system resources
// (deletes the variable made by curl_init)
curl_close($curl);





?>