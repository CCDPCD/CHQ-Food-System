// standard leaflet map setup
var map = L.map('mapid');
map.setView([42.350, -79.306], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ESRI Geocoder
var searchControl = L.esri.Geocoding.geosearch().addTo(map);
var results = L.layerGroup().addTo(map);
searchControl.on('results', function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});


var geojsonMarkerOptions = {
    radius: 10,
    fillColor: "hsl(96, 53%, 71%)",
    color: "#000",
    weight: 1.5,
    opacity: 1,
    fillOpacity: 0.75
};


// Points Popup
function pointPopup(feature, layer){
  var content = (
    "<p id='popup-header'>" + feature.properties.Trade_Name + "</p>" +
    "<p id='popup-sector'>" + feature.properties.Sector + "</p>" +
    "<p id='popup-subsector'>" + feature.properties.Subsector + "</p>"
  );
  layer.bindPopup(content);
};

//GEOJSON Layer
var geoJSON = L.geoJSON(points, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions)
  },
  onEachFeature: pointPopup
}).addTo(map);


//FILTER GEOJSON
function filterPoints(){
  map.removeLayer(geoJSON);
  var filter_list = [];
  for ( var a in sectors ){
    for ( var b in sectors[a].sub_sectors ){
      if(sectors[a].sub_sectors[b].show_on_map == "True") {
        filter_list.push(sectors[a].sub_sectors[b].sub_sector_name);
      };
    };
  };
  geoJSON = L.geoJSON(points, {
    filter: function(feature) {
      if (filter_list.length == 0){
        return true;
      } else {
        var true_list = [];
        var c = feature.properties.Subsector.split(',');
        for (var d in c) {
          if (filter_list.includes(c[d])) {
            true_list.push(c);
          }
        };
        if (true_list.length == filter_list.length) {
          return true
        } else {
          return false
        }
      }
    },
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions )
    },
    onEachFeature: pointPopup
  }).addTo(map);
};
