
//Global variables
    
$ajax1= {} //Empty object to hold the information needed for the other api calls
$weather = {} //empty object to hold weather info
$wiki = {} //empty object to hold wiki info


function ajax1 () {
        
        $.ajax({
        url: "./Libs/PHP/getPostCode.php",
        type: 'POST',
        dataType: 'json',
        data: {
            postcode: $pc,
            country: $country

        },
        
        success: function(result) {

            console.log(result);

            if (result.status.name == "ok") {

                $ajax1.placeName = result['data'][0]['placeName']
                $ajax1.lat = result['data'][0]['lat'];
                $ajax1.lng = result['data'][0]['lng'];
                $('#results').html($ajax1.placeName);
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            if(errorThrown){
                alert('please enter a valid postcode')
            }
        }
    }); 
}

function ajax2 () {
    
    $.ajax({
    url: "./Libs/PHP/getWeather.php",
    type: 'POST',
    dataType: 'json',
    data: {
        lat: $ajax1.lat,
        lng: $ajax1.lng

    },
    
    success: function(result) {

        console.log(result);

        if (result.status.name == "ok") {

            $weather.clouds = result['data']['weatherObservation']['clouds']
            $weather.temp = result['data']['weatherObservation']['temperature']
            $weather.station = result['data']['weatherObservation']['stationName']
            $weather.datetime = result['data']['weatherObservation']['datetime']
            $('#results').html(`The current temperature in ${$ajax1.placeName} is ${$weather.temp} degress celcius, with ${$weather.clouds}. The observation was made by ${$weather.station} at ${$weather.datetime}`)
            
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        if(errorThrown){
            alert('please enter a valid postcode')
        }
    }
}); 
}

function ajax3 () {
        
    $.ajax({
    url: "./Libs/PHP/getWiki.php",
    type: 'POST',
    dataType: 'json',
    data: {
        postcode: $pc,
        country: $country

    },
    
    success: function(result) {

        console.log(result);

        if (result.status.name == "ok") {

            $wiki.summary = result['data'][0]['summary']
            $wiki.distance = result['data'][0]['distance'];
            $wiki.link = result['data'][0]['wikipediaUrl'];
            $wiki.name = result['data'][0]['title'];
            $('#results').html(`${$wiki.summary}. ${$wiki.name} is ${$wiki.distance} miles away. You can find out more <a id="wikiLink" target="_blank"> here</a>`);
            $('#wikiLink').attr("href", `https://${$wiki.link}`);
        }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
 
    
    }
}); 
}

$('#submitButtonOne').click(function() {
    //$('#results').remove();
    $rawPC = $('#postcode').val();
    $country = $('#country').val();
    //String conversions
    $pc = $rawPC.replace(/\s+/g, '');
    ajax1();
    
})

$('#submitButtonTwo').click(function() {
    $('#results').html("");
    ajax2()
    
})

$('#submitButtonThree').click(function() {
        //$('#results').remove();
        $rawPC = $('#postcode').val();
        $country = $('#country').val();
        //String conversions
        $pc = $rawPC.replace(/\s+/g, '');
    $('#results').html("");
    ajax3()
    
})

