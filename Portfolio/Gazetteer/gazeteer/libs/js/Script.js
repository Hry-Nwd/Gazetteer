//Globals


let userLat = "";
let userLng = "";
let selectedCountry = ""




// js.navigator to obtain user position
navigator.geolocation.getCurrentPosition((position) => {

    userLat = position.coords.latitude;
    userLng = position.coords.longitude;
  });

 // Leaflet.JS 
    //Base layers and layer selection
const World_Imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 15,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


    const baseMaps = {
       
        "Satellite": World_Imagery,
        "Street Map": streetMap
    };

const map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    maxZoom: 15,
    layers: [World_Imagery, streetMap],
    zoomControl : false
    });

L.control.layers(baseMaps, null, {position: 'bottomright'} ).addTo(map)

L.control.zoom({position: 'bottomleft'}).addTo(map)
                 
// On Click displays a popup with lat + lng
const popup = L.popup();
const onMapClick = (i) => {
    popup
        .setLatLng(i.latlng)
        .setContent("You clicked the map at " + i.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

// built in leaflet Function to auto locate the User and store the latlng
const onLocationFound = (e) => {
    const radius = e.accuracy;
    
    
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within" + radius + "meters from this point").openPopup();
        
    L.circle(e.latlng, radius).addTo(map); 
    lat = e.latlng
}

const onLocationError = (e) => {
    alert(e.message)
}
map.on('locationfound', onLocationFound)
map.on('locationerror', onLocationError)
map.locate({setView: true, maxZoom: 10});

var border = {}

function weatherApi(city, country){
        
    $.ajax({
        url: `libs/php/restCountries.php`,
        type: "POST",
        dataType: 'json',
        data:{
            city: city,
            country: country
        },
        success: function(result){

            console.log(result)
            
        }
    })
}
function restApi (code) {
    
    $.ajax({
        url: `libs/php/restCountries.php`,
        type: "POST",
        dataType: 'json',
        data:{
            code: code
        },
     

        success: function(result){
            
            const countryName = result.data.name
            const capital = result.data.capital
            const languages = result.data.languages[0].name;
            const population = result.data.population;
            const currency = result.data.currencies[0].name;
            const countryCode = result.data.alpha2Code;
            const latlng = result.data.latlng

            weatherApi(capital, countryCode)

            console.log(result.data)

            $("#capitalCity").html(`${Capital} is the capital of ${countryName}`);
            $("#languages").html(`${languages} is the main language spoken`)
            $("#population").html(`${countryName} has a population of ${population} people`)
            $("#currency").html(`${countryName} uses the ${currency} as its main currency`)
            if(countryName === "Canada"){
                map.flyTo(latlng, 3)
            } else {
                map.flyTo(latlng, 5);
            }
        }
    })
}
// AJAX routines
function getCountryInfo() {
 $.ajax({
        url: "libs/php/getCountryBounds.php",
        type: 'POST',
        dataType: 'json',
        success: function(results){
            results.data.forEach(datum => {
                if(datum.name === selectedCountry){
        
                    restApi(datum.code)
                    
                    $('#flag').attr("src", `https://www.countryflags.io/${datum.code}/shiny/64.png`)
                    $('#countryName').html(`${datum.name}`)
                    
                    if (map.hasLayer(border)) {
                        map.removeLayer(border);
                    }
                    border = L.geoJSON(datum).addTo(map);  
        
                    map.fitBounds(border.getBounds());
                    
                }    
            })
            return countryInfo
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            if(errorThrown){
                console.log(textStatus)
            }
        }
    })
}      




document.getElementById("btn").addEventListener("click", async  () => {
    selectedCountry = $('#country-sel :selected').val()
    getCountryInfo()
    
    
})

//Hamburger menu animation
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelector(".nav-links li");
const line = document.querySelector(".line")

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open")
    line.classList.toggle("x")
})

const menu = document.querySelector(".menu")
const menuText = document.querySelector("#menuText")

const infoCardHeader = document.querySelector("#infoCardHeader");
const countryName = document.querySelector("#countryName");
const flagDiv = document.querySelector("#flagDiv");

const infoCardTab = document.querySelector("#infoCardTabs");
const currencyCardTab = document.querySelector("#currencyCardTabs");
const weatherCardTab = document.querySelector("#weatherCardTabs");

const infoContent = document.querySelector("#mainContent");
const currencyContent = document.querySelector("#currencyContent");
const weatherContent = document.querySelector("#weatherContent");

const closeMenu = document.querySelector("#closeLine");


weatherCardTab.addEventListener("click", () => {
    currencyContent.classList.remove("selected");
    weatherContent.classList.add("selected");
    infoContent.classList.remove("selected");
})


currencyCardTab.addEventListener("click", () => {
    currencyContent.classList.add("selected")
    infoContent.classList.remove("selected");
    weatherContent.classList.remove("selected");
})

infoCardTab.addEventListener("click", () => {
    currencyContent.classList.remove("selected")
    infoContent.classList.add("selected");
    weatherContent.classList.remove("selected");
})

menuText.addEventListener("click", () => {
    infoContent.classList.add("selected");
    menuText.classList.toggle("hide")
    menu.classList.toggle("opened")
    infoCardHeader.classList.toggle("opened")
    countryName.classList.toggle('opened');

    weatherCardTab.classList.toggle("opened")
    infoCardTab.classList.toggle("opened")
    currencyCardTab.classList.toggle("opened")
    closeMenu.classList.toggle("opened")
    flagDiv.classList.remove("hide")
    
    

})



closeMenu.addEventListener("click", () => {
    menu.classList.toggle("opened");
    menuText.classList.toggle("hide")
    infoCardHeader.classList.toggle("opened")
    countryName.classList.toggle('opened');
    infoCardTab.classList.toggle("opened")
    currencyCardTab.classList.toggle("opened")
    closeMenu.classList.toggle("opened")
    currencyContent.classList.remove("selected")
    infoContent.classList.remove("selected");
    flagDiv.classList.add("hide")
    
})
