<?php

	$executionStartTime = microtime(true) / 1000;
    
    
	$url= 'http://api.openweathermap.org/data/2.5/weather?q=' . $_REQUEST['city'] . '.' . $_REQUEST['country'] . '&APPID=6777f552071d95a1f815158fd79b155a';
		

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
	$result=curl_exec($ch);
	curl_close($ch);

	$decode = json_decode($result,true);
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "successful request";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>