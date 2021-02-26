//!  ------ Global Variables ------
//* --- Globals ---
let user = {
    "lat" : "",
    "lng" : "",
    "country": "",
    "currency": {
        "name": "",
        "code": "",
        "symbol": ""
    }
}

let selectedCountry = {
    "name" : "",
    "lat" : "",
    "lng" : "",
    "code" : "",
    "captial": "",
    "currency": {
        "name": "",
        "code": "",
        "symbol": ""
    },
    "border": {},
    "exchangeRate": "",
    "exchangeRateText": "",
    "weather": {
        "mph": "",
        "celc": "",
        "description": "",
        "icon": ""
    },
    "wikiLink": ""
}



let counter = 0 
//* --- DOM ---
const countrySelect = $('#country-sel');
const close = $('#close')
const menu = $('#menuBtn')
//* --- Coverters ---


//! ------ Leaflet.js Setup ------
  //* --- Base layers ---   
const WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

const WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
const WorldPhysical = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service',
	maxZoom: 8
});

const NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 10
});
//* --- Layer object ---
const baseMaps = {
       
    "Street Map": WorldStreetMap,
    "Satellite" : WorldImagery,
    "Terrain" : WorldPhysical,
    "National Geographic": NatGeoWorldMap

};
//* --- Map Initialization ---
const map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    maxZoom: 10,
    layers: [WorldStreetMap],
    zoomControl : false
    });
//* --- Controls --- 
L.control.layers(baseMaps, null, {position: 'bottomright'} ).addTo(map)

//! ------ Functions ------

//* ---Math Functions
const kelvinToCelc = (kelvin) => {
    const celc = Math.floor(kelvin - 273.15 ) 
    return celc
}

const mphConverter = (windspeed) => {
    const mph = Math.floor(windspeed * 2.23694)
    return mph
}

//* --- Main Ajax Call ---

const getInfo = (code) => {

    $.ajax({
        url: "libs/php/getGenericInfo.php",
        type: "POST",
        dataType: 'json',
        data: {
            countryCode: code
        },

        success: function(result){
            if (map.hasLayer(selectedCountry.border)) {
                map.removeLayer(selectedCountry.border);
            }
        
            selectedCountry.border = L.geoJson(result.data.border,{
                color: '#FF0000',
                weight: 2,
                opacity: 0.65
            }).addTo(map);         
        
            map.fitBounds(selectedCountry.border.getBounds());

            selectedCountry.name = result.data.border.properties.name
            selectedCountry.code = result.data.border.properties.iso_a2

            selectedCountry.lat = result.data.info.latlng[0];
            selectedCountry.lng = result.data.info.latlng[1];
            //* Setting flag and infocard title
            $('#flag').attr("src", `https://www.countryflags.io/${selectedCountry.code}/flat/64.png`)
            $('#countryName').html(`${selectedCountry.name}`)

            //* Currency exchange
                //sets users default currency to their countries currency
            
            if (counter === 0){
                user.currency.code = result.data.info.currencies[0].code;
                user.currency.symbol = result.data.info.currencies[0].symbol;
                user.currency.name = result.data.info.currencies[0].name;
                counter++
            }
            selectedCountry.currency.code = result.data.info.currencies[0].code;
            selectedCountry.currency.symbol = result.data.info.currencies[0].symbol;
            selectedCountry.currency.name = result.data.info.currencies[0].name;
            selectedCountry.capital = result.data.info.capital.replace(/\s+/g, "");

            selectedCountry.population = result.data.info.population;
            selectedCountry.language = result.data.info.languages[0].name

                        
            //* More Specific info ajax call

            console.log(selectedCountry)
            $.ajax({
                url: "libs/php/getInfo.php",
                type: "POST",
                data: {
                    capital: selectedCountry.capital,
                    countryCode: selectedCountry.code,
                    country: selectedCountry.name,
                    lat: selectedCountry.lat,
                    lng: selectedCountry.lng,
                    userCurrency: user.currency.code,
                    countryCurrency: selectedCountry.currency.code
                },

                success: function(result){
                 
                    

                     //*General information tab
                    $('#generalInfo').html(`${selectedCountry.capital} is the capital of ${selectedCountry.name}.<br><br> ${selectedCountry.language} is the main spoken language by approximately ${selectedCountry.population} people.<br><br> You can find out more over on wikipedia`);

                    //* Sets Weather Tab Info
                    selectedCountry.weather.description = result.data.weather.current.weather[0].description;
                    selectedCountry.weather.mph = mphConverter(result.data.weather.current.wind_speed);
                    selectedCountry.weather.celc = kelvinToCelc(result.data.weather.current.temp);
                    selectedCountry.weather.icon = result.data.weather.current.weather[0].icon
                    $("#weatherInfo").html(`The current tempurature in ${selectedCountry.name} is ${selectedCountry.weather.celc}°C with ${selectedCountry.weather.description} and wind speeds of ${selectedCountry.weather.mph} miles per hour`)
                    
                        //* Sets forcast

                    let day1Milli = result.data.weather.daily[1].dt * 1000;
                    let day1Obj = new Date(day1Milli)
                    $('#day1').html(day1Obj.toLocaleString("en-US", {weekday: "short"}))

                    let day2Milli = result.data.weather.daily[2].dt * 1000;
                    let day2Obj = new Date(day2Milli)
                    $('#day2').html(day2Obj.toLocaleString("en-US", {weekday: "short"}))

                    let day3Milli = result.data.weather.daily[3].dt * 1000;
                    let day3Obj = new Date(day3Milli)
                    $('#day3').html(day3Obj.toLocaleString("en-US", {weekday: "short"}))

                    $('#temp1').html(kelvinToCelc(result.data.weather.daily[1].temp.day) + '°C')
                    $('#temp2').html(kelvinToCelc(result.data.weather.daily[2].temp.day) + '°C')
                    $('#temp3').html(kelvinToCelc(result.data.weather.daily[3].temp.day) + '°C')

                    
                    $('#icon1').attr('src', `./libs/images/weather/${result.data.weather.daily[1].weather[0].icon}`)
                    $('#icon2').attr('src', `./libs/images/weather/${result.data.weather.daily[2].weather[0].icon}`)
                    $('#icon3').attr('src', `./libs/images/weather/${result.data.weather.daily[3].weather[0].icon}`)

                    //* Sets Wikipedia Link
                    selectedCountry.wikiLink = result.data.link.geonames[0].wikipediaUrl
                    $('#wikiBtn').attr('href', `https://${selectedCountry.wikiLink}`)

                   
                    //* Sets Covid Tab
                  
                    $('#covidText').html(`${selectedCountry.name} currently has ${result.data.covid[0].confirmed} overall cases with  ${result.data.covid[0].deaths} people sadly dead. ${selectedCountry.name} currently has ${result.data.covid.critical} patients in critical condition. However, more than ${result.data.covid.recovered} people have already recovered from the virus`)
        
                    //* Currency tab info with error handling
                    if (!result.data.exchangeRate.error){
                        $('#ERcalc').removeClass('hide') 
                        selectedCountry.currency.exchangeRate = result.data.exchangeRate.rates[`${selectedCountry.currency.code}`]
                        selectedCountry.currency.exchangeRateText = selectedCountry.currency.exchangeRate.toFixed(2)
                        $('#currencyInfo').html(`${selectedCountry.name} uses ${selectedCountry.currency.symbol}${selectedCountry.currency.code} (${selectedCountry.currency.name})<br><br> The current exchange rate is ${selectedCountry.currency.symbol}${selectedCountry.currency.exchangeRateText} to the ${user.currency.name}`)
                    } else {
                        $('#currencyInfo').html(`${selectedCountry.name} uses ${selectedCountry.currency.symbol}${selectedCountry.currency.code} (${selectedCountry.currency.name}).<br><br> Unfortunately there is no information available to work out the exchange rate.`)
                        $('#ERcalc').addClass('hide') 
                    }
                },
            })
        }   
    })
}


//!  ------ Event Listeners ------
countrySelect.on('change', () => {
    $('#infocard').addClass('close')
    menu.removeClass('close')
    getInfo(countrySelect.val())
})

close.on('click', () => {
    $('#infocard').addClass('close')
    menu.removeClass('close')
})

menu.on('click', () => {
    $('#infocard').removeClass('close')
    menu.addClass('close')
})

$('#ERinput').on('change', () => {
    let output = $('#ERinput').val() * selectedCountry.currency.exchangeRate
    $('#ERoutput').html(`${selectedCountry.currency.symbol} ${output.toFixed(2)}`)
})

//! ------ Document Ready ------
$(document).ready(function(){
    
    
    $.ajax({
        url: "./libs/php/getCountryCode.php",
        type: "POST",
        dataType: 'json',
        
        success: function(result) {
            
            result.data.forEach(datum => {
                countrySelect.append(`<option value="${datum.code}">${datum.name}</option>`)
            } )
            
        }
    })
    
    navigator.geolocation.getCurrentPosition((position) => {
            user.lat = position.coords.latitude;
            user.lng = position.coords.longitude;
            $.ajax({
                url: "./libs/php/getUserCountry.php",
                type: "POST",
                dataType: "json",
                data: {
                    lat: user.lat,
                    lng: user.lng
                },
                success : function(result){
                    getInfo(result.data)
                   countrySelect.children(`option[value='${result.data}']`).prop('selected', true);

                }
            })
          });
})
