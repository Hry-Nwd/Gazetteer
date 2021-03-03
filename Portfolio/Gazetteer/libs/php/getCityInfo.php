<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    // information Api
    $url= 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities/' . $_REQUEST['cityId'];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-rapidapi-host: wft-geo-db.p.rapidapi.com",
    "x-rapidapi-key: 3169065d6emshc588611e072ef87p1cfdf6jsn57aafb8fe822"]);
    

    $result=curl_exec($ch);

    curl_close($ch);

    $city = json_decode($result,true);
    
    $ch = curl_init('https://timezone.abstractapi.com/v1/current_time?api_key=4dd90df1850e49c58690948bdd87f06e&location='. $_REQUEST['city'] . ',' . $_REQUEST['country']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    
    $result = curl_exec($ch);
    
    curl_close($ch);

    $time = json_decode($result, true);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['city'] = $city;
    $output['data']['time'] = $time;

    header('Content-Type: application/json; charset=UTF-8;  x-rapidapi-host: covid-19-data.p.rapidapi.com; x-rapidapi-key: 3169065d6emshc588611e072ef87p1cfdf6jsn57aafb8fe822;');

    echo json_encode($output);


?>