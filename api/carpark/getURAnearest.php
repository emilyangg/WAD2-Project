<?php
// This page:
// Receives lat and long
// Return nearest HDB carparks' cpNo, lat, long and other details

// Include URA API Calling, Coordinates Converter and Functions 
include './ura.php';
include_once './xyToSvy21.php';

// Parent Function - Input: Lat and Long of destination; Output: An array of Nearby Carpark No and their details
function getNearestURACP($lat, $long){
    // Convert Lat and Long to SVY21 format
    $EastNorth = convert_xy_to_svy21($lat, $long);
    // var_dump($EastNorth);
    $easting = $EastNorth['X'];
    $northing = $EastNorth['Y'];

    // Call URA CP to get:
    // Carpark No: A0011, Coordinates (E & N): 29730.2995,30701.2921, lots availability: 20
    $URA_CP = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
    $avails_json =  call_ura_api($URA_CP);
    $avails_arr = $avails_json['Result'];

    // Associative array of nearby carparks and their details (coordinates and lots availability)
    $clean_cpno = nearbyCP($avails_arr,$easting,$northing,1000);


    // Call URA CP information to get:
    // Carpark No: A0011, Address: ARMENIAN STREET OFF STREET, Rates: $1.20, parkCapacity: 45, startTime: 07.00 AM, endTime: 11.00 AM
    $URA_info = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
    $URA_details = call_ura_api($URA_info);
    $details_arr = $URA_details['Result'];

    // Associative array of nearby carparks and their details (coordinates, lots availability + ADDRESS and RATES)
    $nearbyCPAndDetails = nearbyURACPDetails($clean_cpno, $details_arr);

    return $nearbyCPAndDetails;
}

// Returns NEARBY Carpark No and their Easting, Northing and Lot Availabilities
function nearbyCP($avails_arr,$in_e,$in_n,$range) {
    $min_e = $in_e - $range;
    $max_e = $in_e + $range;
    $min_n = $in_n - $range;
    $max_n = $in_n + $range;

    $out_assoc_arr = [];

    $destin_latlon = convert_svy21_to_xy($in_e, $in_n);
    $destin_lat = $destin_latlon['latitude'];
    $destin_lon = $destin_latlon['longitude'];

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
                $this_n = $this_en_list[1];
                
                if ($this_e >= $min_e and $this_e <= $max_e and $this_n >= $min_n and $this_n <= $max_n) {
                    $rel_distance = 
                    $this_cp_num = $avails_arr[$i]['carparkNo'];
                    $this_lot_avails = $avails_arr[$i]['lotsAvailable'];
                    $this_EN = convert_svy21_to_xy($this_e, $this_n);
                    $this_lat = $this_EN['latitude'];
                    $this_long = $this_EN['longitude'];

                    $this_rel_dist_km = LatLonToDistance($destin_lat,$destin_lon,$this_lat,$this_long)

                    $out_assoc_arr[$this_cp_num] = [$this_lat,$this_long,$this_lot_avails,$this_rel_dist_km];
                }
            }
            // echo '<br>';
        }
    }
    
    return $out_assoc_arr;
}

// Returns NEARBY Carpark No and their Easting, Northing and Lot Availabilities + Address and Rates
function nearbyURACPDetails($clean_cpno, $details_arr){
    $out_assoc_arr = [];

    for ($i=0;$i<count($details_arr);$i++) {
        $this_lot_type =  $details_arr[$i]['vehCat'];
        $this_cpNo = $details_arr[$i]['ppCode'];

        // If lot type is Car and cpNo is nearby
        if ($this_lot_type == 'Car' and array_key_exists($this_cpNo, $clean_cpno)) {

            $this_address = $details_arr[$i]['ppName'];
            $this_wkday_rates = $details_arr[$i]['weekdayRate'];
            $this_sat_rates = $details_arr[$i]['satdayRate'];
            $this_sun_rates = $details_arr[$i]['sunPHRate'];
            $this_latitude = $clean_cpno[$this_cpNo][0];
            $this_longitude = $clean_cpno[$this_cpNo][1];
            $this_lot_avail = $clean_cpno[$this_cpNo][2];
    

            $out_assoc_arr[$this_cpNo] = [
                "Address" => $this_address, 
                "WeekdayRates" => $this_wkday_rates, 
                "SatRates" => $this_sat_rates, 
                "Sun/PHRates" => $this_sun_rates,
                "Latitude" => $this_latitude, 
                "Longitude" => $this_longitude, 
                "LotAvail" => $this_lot_avail
            ];
            // echo '<br>';
        }
    }

    return $out_assoc_arr;
}

// Converts difference in Latitude and Longitude into Kilometers
// Source: https://www.geodatasource.com/developers/php
function LatLonToDistance($lat1, $lon1, $lat2, $lon2) {
    if (($lat1 == $lat2) && ($lon1 == $lon2)) {
        return 0;
    }
    else {
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
    
        return ($miles * 1.609344);
    }
  }

?>