//Globals
let userLat = "";
let userLng = "";
let selectedCountry = ""
let countryInfo = {
    "geometry":{},
    "properties":{}
}



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
    const overlay = {

    }

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

// AJAX routines
function getCountryInfo() {
    $.ajax({
        url: "libs/php/getCountryBounds.php",
        type: 'POST',
        dataType: 'json',
        success: function(results){
            results.data.forEach(datum => {
                if(datum.name === selectedCountry){
                    countryInfo.properties.iso_a2 = datum.code
                    countryInfo.properties.name = datum.name

                    console.log(datum)
                  
                    /*if(countryInfo.geometry.type === "Polygon"){
                        map.flyTo([countryInfo.geometry.coordinates[0][0][1], countryInfo.geometry.coordinates[0][0][0]], 4 )
                    }else{
                        if(countryInfo.properties.name === "Canada"){
                            map.flyTo([countryInfo.geometry.coordinates[10][0][0][1], countryInfo.geometry.coordinates[10][0][0][0]], 3 )
                        } else if (countryInfo.properties.name === "Australia") {
                            map.flyTo([countryInfo.geometry.coordinates[1][0][0][1], countryInfo.geometry.coordinates[1][0][0][0]], 3 )
                        } else {
                            map.flyTo([countryInfo.geometry.coordinates[0][0][0][1], countryInfo.geometry.coordinates[0][0][0][0]], 4 )
                        }
                    }*/
                    $('#flag').attr("src", `https://www.countryflags.io/${countryInfo.properties.iso_a2}/shiny/64.png`)
                    $('#countryName').html(`${countryInfo.properties.name}`)
                    
                    if (map.hasLayer(border)) {
                        map.removeLayer(border);
                    }
                    border = L.geoJSON(datum).addTo(map);  
        
                    map.fitBounds(border.getBounds());
                }    
            })
            
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            if(errorThrown){
                console.log(textStatus)
            }
        }
    })

    $.ajax({
        url: "libs/php/restCountries.php",
        type: 'POST',
        dataType: 'json',
        data: {
            code: countryInfo.properties.iso_a2
        },
        
        success: function(result) {


            if (result.status.name == "ok") {
                console.log(result);

                console.log(result.capital)
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            if(errorThrown){
                console.log(textStatus)
            }
        }
    }); 
        
}      




document.getElementById("btn").addEventListener("click", () => {
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
const infoImage = document.querySelector("#info")
const infoCardHeader = document.querySelector("#infoCardHeader");
const countryName = document.querySelector("#countryName");


infoImage.addEventListener("click", () => {
    menu.classList.toggle("opened")
    infoCardHeader.classList.toggle("opened")
    countryName.classList.toggle('opened');
    infoImage.classList.toggle("hide")
})

const closeMenu = document.querySelector("#closeLine")

closeMenu.addEventListener("click", () => {
    menu.classList.toggle("opened");
    infoImage.classList.toggle("hide")
    infoCardHeader.classList.toggle("opened")
    countryName.classList.toggle('opened');
    
})
