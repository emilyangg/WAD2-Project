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


// Get CP that has Eastings and Northings within the range
$cpEast = "123";
$cpNorth = "456";

if ($cpEast >= $minEasting and $cpEast <= $minEasting )


// Call URA CP to get:
// Carpark No: A0011, Coordinates (E & N): 29730.2995,30701.2921, lots availability: 20, lot type: C
// $URA_CP = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability";
// call_ura_api($URA_CP);









// Call URA CP information to get:
// Carpark No: A0011, Address: ARMENIAN STREET OFF STREET, Rates: $1.20, parkCapacity: 45, startTime: 07.00 AM, endTime: 11.00 AM
// $URA_info = "https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Details";
// call_ura_api($URA_info);





?>