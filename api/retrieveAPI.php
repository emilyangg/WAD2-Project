<?php

// create & initialize a curl session
function call_carpark_availability_api($url1) {
    $curl = curl_init();
    
    
    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL,$url1 );
    
    // Set cURL Headers
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'AccessKey: 31d76d00-70aa-46bc-b5d0-5e025149ac5a',
      'Token: w4eVdfDgYWc15e6PU7ZUKNB7dX0d16-gnbQ-xddrpD@F5MaZ6Ecc2aabHr5@20BhF0sDS-m4AVc--5gcs23Xcda0y35MnExja56Y',
    ));
    
    // return the transfer as a string, also with setopt()
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    // To prevent Curl error: SSL certificate problem: unable to get local issuer certificate
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

    // if(curl_exec($curl) === false)
    // {
    //     echo 'Curl error: ' . curl_error($curl);
    // }
    // else
    // {
    //     echo 'Operation completed without any errors';
    // }

  
    // curl_exec() executes the started curl session
    // $output contains the output string
    $output = curl_exec($curl);
    

    // close curl resource to free up system resources
    // (deletes the variable made by curl_init)
    curl_close($curl);

    $out_assoc = json_decode($output);
    
    echo gettype($out_assoc);
    
    return $output;

}

function call_carpark_details_api($url2) {
  $curl = curl_init();
  
  
  // set our url with curl_setopt()
  curl_setopt($curl, CURLOPT_URL,$url2 );
  
  // Set cURL Headers
  curl_setopt($curl, CURLOPT_HTTPHEADER, array(
    'AccessKey: 31d76d00-70aa-46bc-b5d0-5e025149ac5a',
    'Token: w4eVdfDgYWc15e6PU7ZUKNB7dX0d16-gnbQ-xddrpD@F5MaZ6Ecc2aabHr5@20BhF0sDS-m4AVc--5gcs23Xcda0y35MnExja56Y',
  ));
  
  // return the transfer as a string, also with setopt()
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

  // To prevent Curl error: SSL certificate problem: unable to get local issuer certificate
  curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);

  // if(curl_exec($curl) === false)
  // {
  //     echo 'Curl error: ' . curl_error($curl);
  // }
  // else
  // {
  //     echo 'Operation completed without any errors';
  // }


  // curl_exec() executes the started curl session
  // $output contains the output string
  $output = curl_exec($curl);
  

  // close curl resource to free up system resources
  // (deletes the variable made by curl_init)
  curl_close($curl);

  $out_assoc = json_decode($output);
  
  // echo gettype($out_assoc);
  
  return $output;

}

$url1 = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
$url2 = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";

// echo call_carpark_availability_api($url1);
echo call_carpark_details_api($url2);

?>