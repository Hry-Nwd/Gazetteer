//!  ------ Global Variables ------
//* --- Globals ---
let userLat = "" 
let userLng = ""
let selectedCountry = ""
let selectedCountryCode = ""
let border = {}
//* --- DOM ---
const countrySelect = $('#country-sel');

const flag = $('#flag');

const menu = $(".menu")
const menuText = $("#menuText")
const closeMenu = $("#closeLine");

const infoCardHeader = $("#infoCardHeader");
const countryName = $("#countryName");
const flagDiv = $("#flagDiv");

const infoCardTab = $("#infoCardTabs");
const currencyCardTab = $("#currencyCardTabs");
const weatherCardTab = $("#weatherCardTabs");

const infoContent = $("#mainContent");
const currencyContent = $("#currencyContent");
const weatherContent = $("#weatherContent");

const hamburger = $(".hamburger");
const navLinks = $(".nav-links");
const links = $(".nav-links li");
const line = $(".line")

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
        url: "libs/php/getInfo.php",
        type: "POST",
        dataType: 'json',
        data: {
            countryCode: code
        },

        success: function(result){

            if (map.hasLayer(border)) {
                map.removeLayer(border);
            }
        
            border = L.geoJson(result.data.border,{
                color: '#FF0000',
                weight: 2,
                opacity: 0.65
            }).addTo(map);         
        
            map.fitBounds(border.getBounds());

            selectedCountry = result.data.border.properties.name
            selectedCountryCode = result.data.border.properties.iso_a2

            flag.attr("src", `https://www.countryflags.io/${selectedCountryCode}/flat/64.png`)
            countryName.html(`${selectedCountry}`)
        
        } 
    })
}


//!  ------ Event Listeners ------
countrySelect.on('change', () => {
    getInfo(countrySelect.val())
})

menuText.on('click', () => {
    menu.addClass('opened');
    countryName.removeClass('hide');
})
hamburger.on("click", () => {
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
                    getInfo(result.data)
                   countrySelect.children(`option[value='${result.data}']`).prop('selected', true);
                }
            })
            
          });
    
})
