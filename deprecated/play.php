<?php

function convert_time($time_str) {
    $hours = substr($time_str,0,2);
    $minutes = substr($time_str,3,2);

    if (strpos($time_str, 'AM') && $hours == '12') {
        $hm_str = '00'.$minutes.'H';

    } elseif (strpos($time_str, 'PM') && $hours == '12') {
        $hm_str = '12' . $minutes . 'H';

    }elseif (strpos($time_str, 'AM')) {  

        $hm_str = $hours . $minutes . 'H';

    } elseif (strpos($time_str, 'PM')) {
        
        $int_h = intval($hours) + 12;
        $hm_str = strval($int_h) . $minutes . 'H';

    } else {
        $hm_str = '0000H';
    }

    return $hm_str;
}

echo('5pm BECOMES ');
echo convert_time('05.00 PM');

echo('12PM BECOMES ');
echo convert_time('12.30 PM');

?>