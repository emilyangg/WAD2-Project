<?php
 echo 1;
// create & initialize a curl session
function call_carpark_availability_api($url1) {
    $curl = curl_init();
    
    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL, $url1);
    
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
    
    // Display in array data type
    $out_assoc = json_decode($output, true);
    
    var_dump($out_assoc['Result'][8]);
    // var_dump($out_assoc['Result'][1]);
    // var_dump($out_assoc['Result'][2]);
    // var_dump($out_assoc['Result'][3]);
    // var_dump($out_assoc['Result'][4]);
    // var_dump($out_assoc['Result'][5]);
    // var_dump($out_assoc['Result'][6]);

    echo $out_assoc['Result'][0]['carparkNo'];
    
    return $output;
}

$url1 = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
call_carpark_availability_api($url1);

?>