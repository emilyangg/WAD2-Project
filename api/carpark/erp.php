<?php

// create & initialize a curl session
function call_erp_api($url) {
    $curl = curl_init();
  
    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL,$url );
    
    // Set cURL Headers
    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
      'AccountKey: EmFN1ld7QfmG134bKA90dQ==',
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

    $out_assoc = json_decode($output, true);
    echo $output; 
    // var_dump($out_assoc);
    
    return $out_assoc;

}

$url = "http://datamall2.mytransport.sg/ltaodataservice/ERPRates";

echo call_erp_api($url);

?>