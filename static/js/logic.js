let coords = [36.746841, -119.772591];
let mapZoomLevel = 4.5;


function getRadius(magnitude) {
    // this will take the magnitude in and give a radius
    r = magnitude*3
    return r
};

function getColor(magnitude) {
    // this will take the radius in and assign a color
    colors  = ['#dd0606', '#ff4141', '#fc8d59', '#fdbb84','#fbe99d', '#78c679']
    if (magnitude >= 5 ) {
        c = colors[0];
    } else if (magnitude >= 4) {
        c = colors[1];
    } else if (magnitude >= 3) {
        c = colors[2];
    } else if (magnitude >= 2) {
        c = colors[3];

    } else if (magnitude >= 1) {
        c = colors[4];

    } else if (magnitude < 1) {
        c = colors[5];
    }

    return c
};

// Map creation function 
function createMap(earthquakes) {
    // Create the light layer for the map
    const light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: attribution,
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });

    // Create the map object
    const myMap = L.map("map", {
        center: coords,
        zoom: mapZoomLevel,
        layers: [light, earthquakes]
    });

    console.log(earthquakes);

    // add legend 
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i+1] + '<br>' : '+');
        }
    
        return div;
    };
    
    legend.addTo(myMap);
    
};



// Marker creation function 
function createMarkers(response) {
    let data = response.features;
    console.log(data);
    // console.log(data[0].properties.mag)
    // console.log(data[0].geometry.coordinates[1])

    // Initate empty list of earthquake markers 
    let earthquakeMarkers = [];


    // let count = 0
    // if (count < 10) {
    // Loop through each earthquake, create a circle marker, and add the marker to the list
    data.forEach(earthquake => {
        let lat = earthquake.geometry.coordinates[1];
        let lon = earthquake.geometry.coordinates[0];
        let mag = earthquake.properties.mag;
        let place = earthquake.properties.place
        let time = Date(earthquake.properties.time)
        // let latlng = L.latLng(earthquake.geometry.coordinates)

        // send magnitued to radius function
        getRadius(mag);
        getColor(mag);

        let marker = L.circleMarker([lat, lon], 
            {radius : r,
            color: c,
            fillOpacity: 1
            })
            .bindPopup(`<h2> ${place}</h2><hr><h2>${mag} magnitude</h2><p>${time}</p>`)
            ;
     
        earthquakeMarkers.push(marker);
        // count += count;

         console.log(mag)
         console.log(c)
         console.log(time)


    });
    // };
    


    // Group the markers to a map layer 
    const markersLayer = L.layerGroup(earthquakeMarkers);

    // call the map creation function 
    createMap(markersLayer);



};

// Get the Geojson data and call the marker creation function 
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson', createMarkers);