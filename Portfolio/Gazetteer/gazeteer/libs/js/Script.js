//!  ------ Global Variables ------
//* --- Globals ---
let userLat = "" 
let userLng = ""
let selectedCountry = ""
let border = {}
//* --- DOM ---
const countrySelect = $('#country-sel');

const menu = document.querySelector(".menu")
const menuText = document.querySelector("#menuText")
const closeMenu = document.querySelector("#closeLine");

const infoCardHeader = document.querySelector("#infoCardHeader");
const countryName = document.querySelector("#countryName");
const flagDiv = document.querySelector("#flagDiv");

const infoCardTab = document.querySelector("#infoCardTabs");
const currencyCardTab = document.querySelector("#currencyCardTabs");
const weatherCardTab = document.querySelector("#weatherCardTabs");

const infoContent = document.querySelector("#mainContent");
const currencyContent = document.querySelector("#currencyContent");
const weatherContent = document.querySelector("#weatherContent");

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelector(".nav-links li");
const line = document.querySelector(".line")

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
const getInfo = (code) => {
    $.ajax({
        url: "libs/php/getCountryBorder.php",
        type: "POST",
        dataType: 'json',
        data: {
            countryCode: code
        },

        success: function(result){

            console.log(result.border)
            if (map.hasLayer(border)) {
                map.removeLayer(border);
            }
        
            border = L.geoJson(result.border,{
                color: '#FF0000',
                weight: 2,
                opacity: 0.65
            }).addTo(map);         
        
            map.fitBounds(border.getBounds());
        
        } 
    })
}


//!  ------ Event Listeners ------
countrySelect.on('change', () => {
    getInfo(countrySelect.val())
})

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
    
    weatherCardTab.classList.toggle("opened")
    infoCardTab.classList.toggle("opened")
    currencyCardTab.classList.toggle("opened")

    closeMenu.classList.toggle("opened")
    currencyContent.classList.remove("selected")
    infoContent.classList.remove("selected");
    weatherContent.classList.remove("selected")
    flagDiv.classList.add("hide")
    
})

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open")
    line.classList.toggle("x")
})

//! ------ Document Ready ------
$(document).ready(function(){
    
    
    $.ajax({
        url: "./libs/php/getCountryCode.php",
        type: "POST",
        dataType: 'json',
        
        success: function(result) {
            
            result.data.forEach(datum => {
                countrySelect.append(`<option value="${datum.code}">${datum.name}</option>`);
                
            } )
            
        }
    })
    
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
            $.ajax({
                url: "./libs/php/getUserCountry.php",
                type: "POST",
                dataType: "json",
                data: {
                    lat: userLat,
                    lng: userLng
                },
                success : function(result){
                    console.log(result.data)
                    getInfo(result.data)
                   countrySelect.children(`option[value='${result.data}']`).prop('selected', true);
                }
            })
            
          });
    
})
