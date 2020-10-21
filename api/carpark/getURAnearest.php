<?php
// include './ura.php';
// include './xyToSvy21.php';

// Returns nearby carparks and their details
function nearbyCP($avails_arr,$in_e,$in_n,$range) {
    $min_e = $in_e - $range;
    $max_e = $in_e + $range;
    $min_n = $in_n - $range;
    $max_n = $in_n + $range;

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
                
                if ($this_e >= $min_e and $this_e <= $max_e and $this_n >= $min_n and $this_n <= $max_n) {
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

// Testing
// Given Lat and Long (SMU LKCSB)
// $lat = "1.2953";
// $long = "103.8506";

// // Convert Lat and Long to SVY21 format
// $EastNorth = convert_xy_to_svy21($lat, $long);
// var_dump($EastNorth);
// $easting = $EastNorth['X'];
// $northing = $EastNorth['Y'];

// // Call URA CP to get:
// // Carpark No: A0011, Coordinates (E & N): 29730.2995,30701.2921, lots availability: 20, lot type: C
// $URA_CP = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
// $avails_json =  call_ura_api($URA_CP);
// $avails_arr = $avails_json['Result'];

// $clean_cpno = nearbyCP($avails_arr,$easting,$northing,1000);

// var_dump($clean_cpno);


// Call URA CP information to get:
// Carpark No: A0011, Address: ARMENIAN STREET OFF STREET, Rates: $1.20, parkCapacity: 45, startTime: 07.00 AM, endTime: 11.00 AM
// $URA_info = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
// call_ura_api($URA_info);





?>