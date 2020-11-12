<?php
// This page:
// Receives lat and long
// Return nearest HDB carparks' cpNo, lat, long and other details

// Include HDB API Calling, Coordinates Converter and Functions 
include './hdb.php';
include_once './xyToSvy21.php';

// Marine Parade
// $lat = 1.3033;
// $long = 103.9140;

// SMU
// $lat = 1.2953;
// $long = 103.8506;

// Parent Function - Input: Lat and Long of destination; Output: An array of Nearby Carpark No and their details
function getNearestHDBCP($lat, $long){

    // Convert Lat and Long to SVY21 format
    $EastNorth = convert_xy_to_svy21($lat, $long);
    // var_dump($EastNorth);
    $easting = $EastNorth['X'];
    $northing = $EastNorth['Y'];

    // HDB Information
    // Carpark Number, x and y coordinates (E and N), address, free parking 
    // eg. BR21, 34387.1259 & 30595.5166, Blk 41 Jalan Bahagia, SUN & PH FR 7AM-10.30PM
    $HDBInfo = callAPI('GET', 'https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&limit=3978', false);
    $HDBInfoResponse = json_decode($HDBInfo, true);
    $HDBInfoArr = $HDBInfoResponse['result']['records'];

    // HDB Carpark Availability
    // Carpark Number, Total Lots, Lot Type, Lots Availability 
    // eg. HE12, 91, C, 0
    $HDB_CP = callAPI('GET', 'https://api.data.gov.sg/v1/transport/carpark-availability', false);
    $HDBLots = json_decode($HDB_CP, true);
    $HDBLotsArr = $HDBLots['items'][0]['carpark_data'];

    // Get nearby carpark details FROM HDB Information API with INPUT's COORDINATES and RANGE
    $nearbyCPArr = nearbyHDBCPDetails($HDBInfoArr,$easting,$northing,1000);

    // Add available carpark lots FROM HDB Carpark Availability API to nearby carpark details
    $nearbyCPWithLots = addCPLots($nearbyCPArr, $HDBLotsArr);

    return $nearbyCPWithLots;
}

// Returns NEARBY Carpark No and its address, latitude, longitude, free parking timings, short term parking and night parking
function nearbyHDBCPDetails($HDBInfoArr,$inEasting,$inNorthing,$range) {
    $minEasting = $inEasting - $range;
    $maxEasting = $inEasting + $range;
    $minNorthing = $inNorthing - $range;
    $maxNorthing = $inNorthing + $range;

    $inLatLong = convert_svy21_to_xy($inEasting, $inNorthing);
    $inLat = $inLatLong['latitude'];
    $inLon = $inLatLong['longitude'];

    $centralCP = ["ACB", "BBB", "BRB1", "CY", "DUXM", "HLM", "KAB", "KAM", "KAS", "PRM", "SLS", "SR1", "SR2", "TPM", "UCS", "WCB"];

    $outAssocArr = [];
    for ($i=0;$i<count($HDBInfoArr);$i++){
        $thisEasting = $HDBInfoArr[$i]['x_coord'];
        $thisNorthing = $HDBInfoArr[$i]['y_coord'];

        if ($thisEasting >= $minEasting and $thisEasting <= $maxEasting and $thisNorthing >= $minNorthing and $thisNorthing <= $maxNorthing) {

            $thisCpNo = $HDBInfoArr[$i]['car_park_no'];
            $thisAddress = $HDBInfoArr[$i]['address'];
            $thisFreeParking = $HDBInfoArr[$i]['free_parking'];
            $thisSTParking = $HDBInfoArr[$i]['short_term_parking'];
            $thisNParking = $HDBInfoArr[$i]['night_parking'];
            $thisRate = "$0.60";
            if (in_array($thisCpNo, $centralCP)){
                $thisRate = "$1.20";
            }

            // Convert EN to Lat and Long
            $thisLatLong = convert_svy21_to_xy($thisEasting, $thisNorthing);
            $thisLat = $thisLatLong['latitude'];
            $thisLong = $thisLatLong['longitude'];

            $thisDistance = LatLonToDistance($inLat,$inLon,$thisLat,$thisLong);

            $outAssocArr[$thisCpNo] = [
                "Address" => $thisAddress, 
                "Latitude" => $thisLat, 
                "Longitude" => $thisLong, 
                "Free Parking" => $thisFreeParking, 
                "Short Term Parking" => $thisSTParking, 
                "Night Parking" => $thisNParking,
                "Rates" => $thisRate,
                "DistanceToDest" => $thisDistance 
            ];

        }
    }
    return $outAssocArr;
}

// Adds Lots Available to given nearbyCPArr 
function addCPLots($nearbyCPArr, $HDBAvailArr){
    for ($i=0;$i<count($HDBAvailArr);$i++) {
        $thisLotType = $HDBAvailArr[$i]['carpark_info'][0]['lot_type'];
        $thisCpNo = $HDBAvailArr[$i]['carpark_number'];

        if ($thisLotType == 'C' and array_key_exists($thisCpNo, $nearbyCPArr)){
            $thisLotAvail = $HDBAvailArr[$i]['carpark_info'][0]['lots_available'];
            $nearbyCPArr[$thisCpNo]['Lots Available'] = $thisLotAvail;
        }
    }
    return $nearbyCPArr;
}

// $nearbyHDBCP = getNearestHDBCP($lat, $long);
// var_dump($nearbyHDBCP);

?>