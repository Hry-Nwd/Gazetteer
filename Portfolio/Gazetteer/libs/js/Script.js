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
    "cities": {
    },
    "randomCity": {

    },
    "border": {},
    "markers" : {
        "cityMarkers": {},
        "poiMarkers": {}
    },
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
const citySelect = $('#city-sel')
//* --- Coverters ---


//! ------ Leaflet.js Setup ------
  //* --- Base layers ---   
const WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

const WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


const NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	maxZoom: 10
});
//* --- Layer object ---
const baseMaps = {
       
    "Street Map": WorldStreetMap,
    "Satellite" : WorldImagery,
    "National Geographic": NatGeoWorldMap

};
//* --- Map Initialization ---
const map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    minZoom: 2,
    layers: [WorldStreetMap],
    zoomControl : false
    });
//* --- Controls --- 
L.control.layers(baseMaps).addTo(map);

//* --- Icons ---
var redMarker = L.ExtraMarkers.icon({
    icon: 'fa-coffee',
    markerColor: 'green',
    shape: 'star',
    prefix: 'fa'
  });

  const whiteCog = L.ExtraMarkers.icon({
    shape: 'penta',
    markerColor: 'white',
    prefix: 'icon',
    icon: 'plus sign',
    iconColor: '#fff',
    iconRotate: 0,
    extraClasses: '',
    number: '',
    svg: false
  })


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
const randomCityFunc = () => {
    i = Math.floor(Math.random() * selectedCountry.cities.data.length)
   
    selectedCountry.randomCity.name = selectedCountry.cities.data[i].name
    selectedCountry.randomCity.id = selectedCountry.cities.data[i].wikiDataId
}
let cityInfoReset = () => {
    $('#cityText').html('');
} 


const cityInfoText = (cityId,city) => {

    if(map.hasLayer(selectedCountry.markers)){
        selectedCountry.markers.remove()
    }
    
    $.ajax({
        url: "libs/php/getCityInfo.php",
        type: "POST",
        data: {
            city: city,
            country: selectedCountry.name,
            cityId: cityId
        },
        
        success: function(result) {

            if(result.data.time){
                let cityTime = result.data.time.datetime
                let cityTimeMs = Date.parse(cityTime)
                let cityTimeDate = new Date(cityTimeMs)
                cityTime = cityTimeDate.toLocaleTimeString()
                $('#cityText').html(`${result.data.city.data.city} is one of the countries largest cities with a population of ${result.data.city.data.population}. <br><br> ${result.data.city.data.city} which is located in ${result.data.city.data.region} which is a region of ${selectedCountry.name}.<br><br> The time in ${result.data.city.data.city} is <br>${cityTime}`)
            }
           
            
           
            

            $.ajax({
                url: "libs/php/getNearbyPoi.php",
                type: "POST",
                data: {

                    lat: result.data.city.data.latitude,
                    lng: result.data.city.data.longitude,
                    
                },

                success: function(result){
                    
                    if(map.hasLayer(selectedCountry.markers.poiMarkers)){
                        selectedCountry.markers.poiMarkers.remove()
                    }

                    selectedCountry.markers.poiMarkers = L.markerClusterGroup()
                    
                    result.data.poi.results.forEach( i => {
                          selectedCountry.markers.poiMarkers.addLayer( L.marker([i.location.lat, i.location.lng], {
                                title: i.name,
                                icon: whiteCog
                            })
                            .on('click', () => {
                            }).bindPopup(`<h5>${i.name}</h5><br><a role="button" type="button" class="btn btn-outline-secondary" target="_blank" href="${i.website}"> Visit the website!</a><br><strong><br />${i.address}</strong>`).openPopup()
                            )                            
                        })
                     
                    map.addLayer(selectedCountry.markers.poiMarkers)
                    map.fitBounds(selectedCountry.markers.poiMarkers.getBounds());

                }
            })
        }
    })
            
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

            selectedCountry.avgPop = Math.floor(result.data.info.population / 200).toFixed(0)
            selectedCountry.population = result.data.info.population;
            selectedCountry.language = result.data.info.languages[0].name

            selectedCountry.nameNoSpace = selectedCountry.name.replace(/\s+/g, "%20")
           
                        
            //* More Specific info ajax call

          
            $('#loader').fadeIn("slow");
            $.ajax({
                url: "libs/php/getInfo.php",
                type: "POST",
                data: {
                    pop: selectedCountry.avgPop,
                    capital: selectedCountry.capital,
                    countryCode: selectedCountry.code,
                    country: selectedCountry.nameNoSpace,
                    lat: selectedCountry.lat,
                    lng: selectedCountry.lng,
                    userCurrency: user.currency.code,
                    countryCurrency: selectedCountry.currency.code
                },

                success: function(result){
                      //* Error handling
                      if (result.data.exchangeRate.error){
                        $('#currencyInfo').html(`${selectedCountry.name} uses ${selectedCountry.currency.symbol}${selectedCountry.currency.code} (${selectedCountry.currency.name}).<br><br> Unfortunately there is no information available to work out the exchange rate.`)
                        $('#ERcalc').addClass('hide')
                    } else if (!result.data.exchangeRate.error) {
                        selectedCountry.currency.exchangeRate = result.data.exchangeRate.rates[`${selectedCountry.currency.code}`]
                        selectedCountry.currency.exchangeRateText = selectedCountry.currency.exchangeRate.toFixed(2)
                    }
                   
                    if(result.data.cities.errors){
                        $('#cityText').html(`Unfortunately no data on ${selectedCountry.name}'s cities can be retrieved at this time.`)
                        $('#newsCardTitle').html(`Unfortunately no data on ${selectedCountry.name}'s news can be retrieved at this time.`)
                        $('#imagesTitle').html(`Unfortunately no images can be retrieved at this time.`)
                        $('#newsCardBody').fadeOut()
                        $('#imagesBody').fadeOut()
                        $('#cityBtn').addClass("hide")
                    }
                    $('#loader').fadeOut("slow");
                    selectedCountry.weather.description = result.data.weather.current.weather[0].description;
                    selectedCountry.weather.mph = mphConverter(result.data.weather.current.wind_speed);
                    selectedCountry.weather.celc = kelvinToCelc(result.data.weather.current.temp);
                    selectedCountry.weather.icon = result.data.weather.current.weather[0].icon
                    selectedCountry.cities = result.data.cities
                    
                    
                    
                    //*Sets markers
                    //? Removes marker cluster groups
                    if(map.hasLayer(selectedCountry.markers.cityMarkers)){
                        selectedCountry.markers.cityMarkers.remove()
                    }
                    
                    selectedCountry.markers.cityMarkers = L.markerClusterGroup();
                    //? sets marker cluster groups
                        selectedCountry.cities.data.forEach( i => {
                            selectedCountry.markers.cityMarkers.addLayer( L.marker([i.latitude, i.longitude], {
                                title: i.name,
                                icon: redMarker
                            }).on('click', () => {
                                cityInfoText(i.wikiDataId, i.name)
                            }).bindTooltip(`Click me to find local landmarks in ${i.name}`).openTooltip()
                            )
                        })

                        map.addLayer(selectedCountry.markers.cityMarkers)
                        
                        //*General information tab
                        $('#generalInfo').html(`${selectedCountry.capital} is the capital of ${selectedCountry.name}.<br><br> ${selectedCountry.language} is the main spoken language by approximately ${selectedCountry.population.toLocaleString()} people.<br><br> You can find out more over on Wikipedia.`);
                        //?Sets Wikipedia Link
                        
                            selectedCountry.wikiLink = result.data.link.geonames[0].wikipediaUrl
                            $('#wikiBtn').attr('href', `https://${selectedCountry.wikiLink}`)
                        

                     //* Currency Tab
                     $('#ERcalc').removeClass('hide') 
                    
                     $('#currencyInfo').html(`${selectedCountry.name} uses ${selectedCountry.currency.symbol}${selectedCountry.currency.code} (${selectedCountry.currency.name}).<br><br> The current exchange rate is ${selectedCountry.currency.symbol}${selectedCountry.currency.exchangeRateText} to the ${user.currency.name}.`)  
                         
                    //* Sets Weather Tab Info
                    
                   
                    $("#weatherInfo").html(`The current temperature in ${selectedCountry.name} is ${selectedCountry.weather.celc}°C with ${selectedCountry.weather.description} and wind speeds of ${selectedCountry.weather.mph} miles per hour.`)
                    
                        //? Sets forcast
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

                   
                    //* Sets Covid Tab
                    
                    $('#covidText').html(`${selectedCountry.name} currently has ${result.data.covid[0].confirmed.toLocaleString()} overall cases with  ${result.data.covid[0].deaths.toLocaleString()} people sadly dead.<br><br> ${selectedCountry.name} currently has ${result.data.covid[0].critical.toLocaleString()} patients in critical condition. However, more than ${result.data.covid[0].recovered.toLocaleString()} people have already recovered from the virus.`)
                    
                    
                    //*Sets cities tab
                    
                    $('#cityBtn').removeClass("hide")
                    $('#newsCardBody').fadeIn()
                    $('#imagesBody').fadeIn()
                    $('#cityText').html(` One of ${selectedCountry.name} largest cities is ${result.data.cities.data[0].city}.<br><br> Click the button below to find out more information about ${selectedCountry.name}'s top cities.`)

                    //*Sets News Tab
                    if(result.data.news.status === "No matches for your search."){
                        $('.newsDiv').fadeOut("slow")
                        $('#newsCardTitle').html("<h3>Unfortunately, No news feed is Available</h3>");
                    } else if(result.data.news.status === "ok") {
                        $('.newsDiv').fadeIn("fast")
                        $('#newsCardTitle').html("<h3>Recent News</h3>");

                        //? Sets News Cards Image
                        $('#news1Img').attr('src', result.data.news.articles[0].media)
                        $('#news2Img').attr('src', result.data.news.articles[1].media)
                        $('#news3Img').attr('src', result.data.news.articles[2].media)
                        
                        //? Sets News Cards Alt Attr
                        $('#news1Img').attr('alt', result.data.news.articles[0].title)
                        $('#news2Img').attr('alt', result.data.news.articles[1].title)
                        $('#news3Img').attr('alt', result.data.news.articles[2].title)
                        
                        
                        //?Sets News Cards Titles
                        $('#news1Title').html(result.data.news.articles[0].title)
                        $('#news2Title').html(result.data.news.articles[1].title)
                        $('#news3Title').html(result.data.news.articles[2].title)
                        
                        //?Sets News Cards Dates
                        $('#news1Primary').html(result.data.news.articles[0].published_date)
                        $('#news2Primary').html(result.data.news.articles[1].published_date)
                        $('#news3Primary').html(result.data.news.articles[2].published_date)
                        
                        //? Sets News Cards Links
                        $('#news1Link').attr('href', result.data.news.articles[0].link)
                        $('#news2Link').attr('href', result.data.news.articles[1].link)
                        $('#news3Link').attr('href', result.data.news.articles[2].link)

                    }
                       
                    //*Sets Images Tab
                        //? Sets Image Card Image
                    $('#img1').attr('src', result.data.images.value[0].thumbnailUrl)
                    $('#img2').attr('src', result.data.images.value[1].thumbnailUrl)
                    $('#img3').attr('src', result.data.images.value[2].thumbnailUrl)

                        //? Sets Image Card Alt Attr
                    $('#img1').attr('alt', result.data.images.value[0].name)
                    $('#img2').attr('alt', result.data.images.value[1].name)
                    $('#img3').attr('alt', result.data.images.value[2].name)
                        
                        //? Sets Image Card Title
                    $('#img1Title').html(result.data.images.value[0].name)
                    $('#img2Title').html(result.data.images.value[1].name)
                    $('#img3Title').html(result.data.images.value[2].name)

                        //? Sets Image Link
                    $('#imgLink1').attr('href', result.data.images.value[0].hostPageDisplayUrl)
                    $('#imgLink1').attr('href', result.data.images.value[1].hostPageDisplayUrl)    
                    $('#imgLink1').attr('href', result.data.images.value[2].hostPageDisplayUrl)

                  

                },
            })
        }   
    })
}



//!  ------ Event Listeners ------


map.on('click',  (e) => {
  

    $.ajax({
        url: "./libs/php/getUserCountry.php",
        type: "POST",
        dataType: "json",
        data: {
            lat: e.latlng.lat,
            lng: e.latlng.lng
        },
        success : function(result){
            cityInfoReset()
            getInfo(result.data)
           countrySelect.children(`option[value='${result.data}']`).prop('selected', true);

        }
    })
})

countrySelect.on('change', () => {
    $('#infocard').addClass('close')
    menu.removeClass('close')
    getInfo(countrySelect.val())
   
    cityInfoReset()
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
    $('#ERoutput').html(`${selectedCountry.currency.symbol}${output.toFixed(2).toLocaleString()}`)
})

$('#cityBtn').on('click' , () => {
    randomCityFunc()
    cityInfoText(selectedCountry.randomCity.id, selectedCountry.randomCity.name)
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
