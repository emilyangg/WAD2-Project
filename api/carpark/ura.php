<?php

// create & initialize a curl session
function call_ura_api($url) {
	$curl = curl_init();

	// set our url with curl_setopt()
	curl_setopt($curl, CURLOPT_URL,$url );

	// Set cURL Headers
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		'AccessKey: 31d76d00-70aa-46bc-b5d0-5e025149ac5a',
		'Token: 9ZJP-faDbx0W50BG4Pp0AZWPVc@pcuHWPa07d5Ra46ba06q4m4WYA9ecx0q5DCK6g4vcA0+B-VQHe621F5MY@Uc3b-hDyBaQetf5',
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
	//var_dump($output);

	// close curl resource to free up system resources
	// (deletes the variable made by curl_init)
	curl_close($curl);

	$out_assoc = json_decode($output, true);
	return $out_assoc;
	//echo ($out_assoc);
	// echo call_ura_api("carpark availability");
	// echo call_ura_api("carpark details");
}

?>