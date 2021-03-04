<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    // Wiki API
    $url='http://api.geonames.org/wikipediaSearch?q=' . $_REQUEST['capital'] .',' . $_REQUEST['countryCode'] . '&maxRows=10&username=hryinwd&type=JSON';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    

    $result=curl_exec($ch);

    curl_close($ch);

    $link = json_decode($result,true); 

    // ExchangeRate API
    $url= 'https://api.exchangeratesapi.io/latest?symbols=' . $_REQUEST['countryCurrency'] . '&base=' . $_REQUEST['userCurrency'] ;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    

    $result=curl_exec($ch);

    curl_close($ch);

    $exchange_rate = json_decode($result,true); 

    //Weather API
    $url= 'https://api.openweathermap.org/data/2.5/onecall?lat='.$_REQUEST['lat'].'&lon='.$_REQUEST['lng'].'&exclude=hourly,minutely,&APPID=6777f552071d95a1f815158fd79b155a';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    
    $result=curl_exec($ch);

    curl_close($ch);

    $weather = json_decode($result, true);

    //Covid API

    $url= 'https://covid-19-data.p.rapidapi.com/country/code?code=' . $_REQUEST['countryCode'];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-rapidapi-host: covid-19-data.p.rapidapi.com",
    "x-rapidapi-key: 3169065d6emshc588611e072ef87p1cfdf6jsn57aafb8fe822"]);
    

    $result=curl_exec($ch);

    curl_close($ch);


    $covid = json_decode($result,true);

    $url= 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=10&countryIds='. $_REQUEST['countryCode'] .'&minPopulation=' .$_REQUEST['pop'] . '&types=CITY' ;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-rapidapi-host: wft-geo-db.p.rapidapi.com",
    "x-rapidapi-key: 3169065d6emshc588611e072ef87p1cfdf6jsn57aafb8fe822"]);

    $result=curl_exec($ch);

    curl_close($ch);

    $cities = json_decode($result, true);


    $url= 'https://newscatcher.p.rapidapi.com/v1/latest_headlines?lang=en&country=' . $_REQUEST['countryCode'] . '&media=True';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-rapidapi-host:  newscatcher.p.rapidapi.com",
    "x-rapidapi-key: 3169065d6emshc588611e072ef87p1cfdf6jsn57aafb8fe822"]);

    $result=curl_exec($ch);

    curl_close($ch);

    $news = json_decode($result, true);

    $url= 'https://bing-image-search1.p.rapidapi.com/images/search?q=' . $_REQUEST['country'] . '%20landmarks';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["x-rapidapi-host: bing-image-search1.p.rapidapi.com",
    "x-rapidapi-key: 3169065d6emshc588611e072ef87p1cfdf6jsn57aafb8fe822"]);

    $result=curl_exec($ch);

    curl_close($ch);

    $images = json_decode($result, true);
    

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data']['link'] = $link;
    $output['data']['exchangeRate'] = $exchange_rate;
    $output['data']['weather'] = $weather;
    $output['data']['covid'] = $covid;
    $output['data']['cities'] = $cities;
    $output['data']['news'] = $news;
    $output['data']['images'] = $images;
    header('Content-Type: application/json; charset=UTF-8;');

    echo json_encode($output);


?>