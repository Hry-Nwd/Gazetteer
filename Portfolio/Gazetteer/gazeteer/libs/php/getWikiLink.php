<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);


    $url='http://api.geonames.org/wikipediaSearch?q=' . $_REQUEST['capital'] . ',' . $_REQUEST['countryCode'] . '&maxRows=10&username=hryinwd&type=JSON';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);

    $result=curl_exec($ch);

    curl_close($ch);

    $link = json_decode($result,true);       

    //

    $info = json_decode($result,true);  
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['link'] = $link;

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);


