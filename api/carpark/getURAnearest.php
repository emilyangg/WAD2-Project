<?php
include './ura.php';
include './xyToSvy21.php';

// Given Lat and Long (SMU LKCSB)
$lat = "1.2953";
$long = "103.8506";

// Convert Lat and Long to SVY21 format
$EastNorth = convert_xy_to_svy21($lat, $long);
var_dump($EastNorth);
$easting = $EastNorth['X'];
$northing = $EastNorth['Y'];

// Get range for lat and long
$minEasting = $easting - 100;
$maxEasting = $easting + 100;
$minNorthing = $northing - 100;
$maxNorthing = $northing + 100;

// Get Associative Array of nearby CP and its details (CP_no => [carpark details])


// -----------------------------------------------------
// Return Associative Array with CP that  Initiate nearby carpark number arr
$nearby_CP_No_arr = [];

// Store CP (that have Eastings and Northings within the range) and carpark type "C" 
$cpEast = "123";
$cpNorth = "456";

if ($cpEast >= $minEasting and $cpEast <= $maxEasting and $cpNorth >= $minNorthing and $cpEast <= $maxNorthing) {
    array_push($nearby_CP_No_arr, $carparkNo);
}

//--------------------------------------------------------------

// Call URA CP to get:
// Carpark No: A0011, Coordinates (E & N): 29730.2995,30701.2921, lots availability: 20, lot type: C
// $URA_CP = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
// call_ura_api($URA_CP);

$URA_CP = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
$avails_json =  call_ura_api($URA_CP);
$avails_arr = $avails_json['Result'];

//dummy values start
$min_e = 29923.271 - 1000;
$max_e = 29923.271 + 1000;
$min_n = 30853.218 - 1000;
$max_n = 30853.218 + 1000;
//dummy values end

function clean_avails($avails_arr,$minEasting,$maxEasting,$minNorthing,$maxNorthing) {

    $out_assoc_arr = [];

    for ($i=3;$i<count($avails_arr);$i++) {
        $this_lot_type =  $avails_arr[$i]['lotType'];

        if ($this_lot_type == 'C') {
            // echo($i);
            // echo('this is the row number');
            // echo('<br>');
            if (array_key_exists('geometries' ,$avails_arr[$i])) {
                $this_coords_str = $avails_arr[$i]['geometries'][0]['coordinates'];
                $this_en_list = explode(",", $this_coords_str);
                $this_e = $this_en_list[0];
                // echo $this_e;
                $this_n = $this_en_list[1];
                // echo ('  ');
                // echo($this_n);
                // echo '<br>';
                
                if ($this_e >= $minEasting and $this_e <= $maxEasting and $this_n >= $minNorthing and $this_n <= $maxNorthing) {
                    $this_cp_num = $avails_arr[$i]['carparkNo'];
                    $this_lot_avails = $avails_arr[$i]['lotsAvailable'];

                    $out_assoc_arr[$this_cp_num] = [$this_e,$this_n,$this_lot_avails];
                }
            }
            // echo '<br>';
        }
    }
    return $out_assoc_arr;
}


$clean_cpno = clean_avails($avails_arr,$min_e,$max_e,$min_n,$max_n);

var_dump($clean_cpno);


// Call URA CP information to get:
// Carpark No: A0011, Address: ARMENIAN STREET OFF STREET, Rates: $1.20, parkCapacity: 45, startTime: 07.00 AM, endTime: 11.00 AM
// $URA_info = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
// call_ura_api($URA_info);





?>