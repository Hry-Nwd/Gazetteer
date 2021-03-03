<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    
    $url= 'https://trueway-places.p.rapidapi.com/FindPlacesNearby?location='.$_REQUEST['lat'].'%2C'.$_REQUEST['lng'].'&type=tourist_attraction&radius=10000&language=en';
    
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-rapidapi-host: trueway-places.p.rapidapi.com",
    "x-rapidapi-key: 3169065d6emshc588611e072ef87p1cfdf6jsn57aafb8fe822"]);

    $result=curl_exec($ch);

    curl_close($ch);

    $poi = json_decode($result, true);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
   
    $output['data']['poi'] = $poi;

    header('Content-Type: application/json; charset=UTF-8;');

    echo json_encode($output);


?>