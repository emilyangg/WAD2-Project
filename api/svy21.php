<?php

$c = new SVY21_Convertor(); 
$coordinate = $c->onemap_compute(31962.0601,27582.895); // Northing, Easting [second data, first data]
var_dump($coordinate);


class SVY21_Convertor{

	var $b,$e2,$e4,$e6,$A0,$A2,$A4,$A6;

	public function __construct()
	{
		

		$this->f = 1/298.257223563;
		$this->b = $this->a * (1 - $this->f);
        $this->e2 = (2 * $this->f) - ($this->f * $this->f);
        $this->e4 = $this->e2 * $this->e2;
        $this->e6 = $this->e4 * $this->e2;
        $this->A0 = 1 - ($this->e2 / 4) - (3 * $this->e4 / 64) - (5 * $this->e6 / 256);
        $this->A2 = (3. / 8.) * ($this->e2 + ($this->e4 / 4) + (15 * $this->e6 / 128));
        $this->A4 = (15. / 256.) * ($this->e4 + (3 * $this->e6 / 4));
        $this->A6 = 35 * $this->e6 / 3072;
		
	}

	public function test()
	{
		
		
		var_dump($this->onemap_compute($Y,$X));//X Y needs to be right. X means North, Y means East
			
		
	}

	private function calcM($lat){
		$latR = $lat * M_PI / 180;
		return $this->a * (($this->A0 * $latR) - ($this->A2 * sin(2 * $latR)) + ($this->A4 * sin(4 * $latR)) - ($this->A6 * sin(6 * $latR)));
	}
	private function calcRho($sin2Lat){
		$num = $this->a * (1 - $this->e2);
		$denom = pow(1 - $this->e2 * $sin2Lat, 3. / 2.);
		return $num / $denom;
	}

	private function calcV($sin2Lat){
		$poly = 1 - $this->e2 * $sin2Lat;
		return $this->a / sqrt($poly);
	}

	var $oLat = 1.366666; // origin's lat in degrees

	//var $oLat = 1.395131747;
	//var $oLat = 1.338200253;
	//var $oLat = 1.3674745;
    var $oLon = 103.833333; // origin's lon in degrees
    //var $oLon = 103.804651413;
    //var $oLon = 103.862014587;
    //var $oLon = 103.825548667;
    var $oN = 38744.572; // false Northing
	var $oE = 28001.642; // false Easting
    var $k = 1; // scale factor
    var $a = 6378137;
    var $f;

    public function onemap_compute($N, $E){
        // Returns a pair (lat, lon) representing Latitude and Longitude.
    	$oN = 38744.572;
    	$oE = 28001.642;
    	$k = 1;

    	$Nprime = $N - $oN;
    	$Mo = $this->calcM($this->oLat);
    	$Mprime = $Mo + ($Nprime / $this->k);
    	$n = ($this->a - $this->b) / ($this->a + $this->b);
    	$n2 = $n * $n;
    	$n3 = $n2 * $n;
    	$n4 = $n2 * $n2;
    	$G = $this->a * (1 - $n) * (1 - $n2) * (1 + (9 * $n2 / 4) + (225 * $n4 / 64)) * (M_PI / 180);
    	$sigma = ($Mprime * M_PI) / (180. * $G);

    	$latPrimeT1 = ((3 * $n / 2) - (27 * $n3 / 32)) * sin(2 * $sigma);
    	$latPrimeT2 = ((21 * $n2 / 16) - (55 * $n4 / 32)) * sin(4 * $sigma);
    	$latPrimeT3 = (151 * $n3 / 96) * sin(6 * $sigma);
    	$latPrimeT4 = (1097 * $n4 / 512) * sin(8 * $sigma);
    	$latPrime = $sigma + $latPrimeT1 + $latPrimeT2 + $latPrimeT3 + $latPrimeT4;

    	$sinLatPrime = sin($latPrime);
    	$sin2LatPrime = $sinLatPrime * $sinLatPrime;

    	$rhoPrime = $this->calcRho($sin2LatPrime);
    	$vPrime = $this->calcV($sin2LatPrime);
    	$psiPrime = $vPrime / $rhoPrime;
    	$psiPrime2 = $psiPrime * $psiPrime;
    	$psiPrime3 = $psiPrime2 * $psiPrime;
    	$psiPrime4 = $psiPrime3 * $psiPrime;
    	$tPrime = tan($latPrime);
    	$tPrime2 = $tPrime * $tPrime;
    	$tPrime4 = $tPrime2 * $tPrime2;
    	$tPrime6 = $tPrime4 * $tPrime2;
    	$Eprime = $E - $this->oE;
    	$x = $Eprime / ($this->k * $vPrime);
    	$x2 = $x * $x;
    	$x3 = $x2 * $x;
    	$x5 = $x3 * $x2;
    	$x7 = $x5 * $x2;

        // Compute Latitude
    	$latFactor = $tPrime / ($this->k * $rhoPrime);
    	$latTerm1 = $latFactor * (($Eprime * $x) / 2);
    	$latTerm2 = $latFactor * (($Eprime * $x3) / 24) * ((-4 * $psiPrime2) + (9 * $psiPrime) * (1 - $tPrime2) + (12 * $tPrime2));
    	$latTerm3 = $latFactor * (($Eprime * $x5) / 720) * ((8 * $psiPrime4) * (11 - 24 * $tPrime2) - (12 * $psiPrime3) * (21 - 71 * $tPrime2) + (15 * $psiPrime2) * (15 - 98 * $tPrime2 + 15 * $tPrime4) + (180 * $psiPrime) * (5 * $tPrime2 - 3 * $tPrime4) + 360 * $tPrime4);
    	$latTerm4 = $latFactor * (($Eprime * $x7) / 40320) * (1385 - 3633 * $tPrime2 + 4095 * $tPrime4 + 1575 * $tPrime6);
    	$lat = $latPrime - $latTerm1 + $latTerm2 - $latTerm3 + $latTerm4;

        // Compute Longitude
    	$secLatPrime = 1. / cos($lat);
    	$lonTerm1 = $x * $secLatPrime;
    	$lonTerm2 = (($x3 * $secLatPrime) / 6) * ($psiPrime + 2 * $tPrime2);
    	$lonTerm3 = (($x5 * $secLatPrime) / 120) * ((-4 * $psiPrime3) * (1 - 6 * $tPrime2) + $psiPrime2 * (9 - 68 * $tPrime2) + 72 * $psiPrime * $tPrime2 + 24 * $tPrime4);
    	$lonTerm4 = (($x7 * $secLatPrime) / 5040) * (61 + 662 * $tPrime2 + 1320 * $tPrime4 + 720 * $tPrime6);
    	$lon = ($this->oLon * M_PI / 180) + $lonTerm1 - $lonTerm2 + $lonTerm3 - $lonTerm4;

    	return array(
    		"lat" => $lat / ( M_PI / 180),
    		"lng" => $lon / (M_PI / 180)
    		);

    }
	


}



?>