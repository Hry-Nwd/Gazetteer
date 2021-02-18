           //Making a map and tiles
           const mymap = L.map('mapid').setView([0,0], 1);
            
           const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

           const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
           const tiles = L.tileLayer(tileUrl, {attribution})

           tiles.addTo(mymap);
           
           L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
               attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
               maxZoom: 18,
               id: 'mapbox/streets-v11',
               tileSize: 512,
               zoomOffset: -1,
               accessToken: 'pk.eyJ1IjoiaHJ5bndkIiwiYSI6ImNrandxMjkwcDAwdXoybm9mZHg3NDA1YW4ifQ.uSTYxr9Flz6fcAeaqwX54w'
           }).addTo(mymap);    

           //making a custom marker
           const issIcon = L.icon({
               iconUrl: "iss.png",
               iconSize: [50 , 32],
               iconAnchor: [25, 16]
           });
           const marker = L.marker([0, 0], {icon: issIcon}).addTo(mymap);

           // getting data from an external API
           const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';

           let firstTime = true
           async function getIss() {
               const response = await fetch(api_url);
               const data = await response.json();
               const {latitude, longitude} = data; 
               
               marker.setLatLng([latitude, longitude]);
               if(firstTime){
                   mymap.setView([latitude, longitude], 4);
                   firstTime = false;
               }else {
                   mymap.setView([latitude, longitude]);
               }
               
               document.getElementById('lat').textContent = latitude.toFixed(2);
               document.getElementById('long').textContent = longitude.toFixed(2);

               console.log(data.latitude);
               console.log(data.longitude);   
           } 

           getIss();

           setInterval(getIss, 10000);
       
           