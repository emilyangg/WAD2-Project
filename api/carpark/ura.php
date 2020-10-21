<?php

// create & initialize a curl session
function call_ura_api($type) {
    if ($type == "carpark availability") {
      $url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
    } else if ($type == "carpark details") {
      $url = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
    }
    $curl = curl_init();
    
    
    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL,$url );
    
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
    
    return $output;

}

// echo call_ura_api("carpark availability");
echo call_ura_api("carpark details");

?>