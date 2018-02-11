// ---------- Model -------------
// Initial array of breweries in the Denver/Metro area
// TODO: replace this list with a dynamic list via BreweryDB API

// Place Data
// name = brewery name
// lat = latitude
// lng = longitude
// id = google place id
// type = type of establishment (taproom, brewpub [serves food], taphouse [serves beers from other breweries])

var breweryPlaceData = [
    {
        name: "Dry Dock Brewing Company - South Dock",
        location: { lat: 39.652665, lng: -104.812040 },
        type: [ 'Taproom' ]
    },
    {
        name: "Copper Kettle Brewing Company",
        location: { lat: 39.692681, lng: -104.891341 },
        type: [ 'Taproom' ]
    },
    {
        name: "Comrade Brewing Company",
        location: { lat: 39.675659, lng: -104.898488 },
        type: [ 'Taproom' ]
    },
    {
        name: "Peak to Peak Tap & Brew",
        location: { lat: 39.674087, lng: -104.793862 },
        type: [ 'Taproom' , 'Brewpub', 'Taphouse' ]
    },
    {
        name: "Declaration Brewing Company",
        location: { lat: 39.679765, lng: -104.990782 },
        type: [ 'Taproom' ]
    },
    {
        name: "True Brewing Company",
        location: { lat: 39.719919, lng: -104.987686 },
        type: [ 'Taproom' ]
    },
    {
        name: "Living the Dream Brewing",
        location: { lat: 39.540528, lng: -105.039922 },
        type: [ 'Taproom' ]
    },
    {
        name: "Grist Brewing Company",
        location: { lat: 39.549058, lng: -105.033849 },
        type: [ 'Taproom' ]
    },
    {
        name: "Ursula Brewing",
        location: { lat: 39.748301, lng: -104.838031 },
        type: [ 'Taproom' ]
    },
    {
        name: "Launch Pad Brewery",
        location: { lat: 39.700827, lng: -104.789906 },
        type: [ 'Taproom' ]
    },
    {
        name: "Lone Tree Brewing Company",
        location: { lat: 39.562658, lng: -104.892868 },
        type: [ 'Taproom' ]
    },
    {
        name: "105 West Brewing Company",
        location: { lat: 39.380952, lng: -104.867617 },
        type: [ 'Taproom' ]
    },
    {
        name: "Locavore Beer Works",
        location: { lat: 39.608641, lng: -105.036131 },
        type: [ 'Taproom' ]
    },
    {
        name: "38 State Brewing Company",
        location: { lat: 39.568826, lng: -104.989762 },
        type: [ 'Taproom' ]
    },
    {
        name: "Halfpenny Brewing Company",
        location: { lat: 39.593525, lng: -104.927406 },
        type: [ 'Taproom' ]
    },
    {
        name: "Blue Spruce Brewing Company",
        location: { lat: 39.566910, lng: -104.939904 },
        type: [ 'Brewpub' ]
    },
    {
        name: "Rockyard American Grill and Brewing Company",
        location: { lat: 39.409238, lng: -104.869859 },
        type: [ 'Brewpub' ]
    },
    {
        name: "Breckenridge Brewery Farm House",
        location: { lat: 39.593803, lng: -105.023768 },
        type: [ 'Brewpub' ]
    },
    {
        name: "Dad & Dudes Breweria",
        location: { lat: 39.593947, lng: -104.806407 },
        type: [ 'Brewpub' ]
    },
    {
        name: "Pints Pub Brewery and Freehouse",
        location: { lat: 39.736973, lng: -104.990853 },
        type: [ 'Taproom' , 'Brewpub', 'Taphouse' ]
    },
    {
        name: "Vine Street Pub & Brewery",
        location: { lat: 39.743472, lng: -104.961993 },
        type: [ 'Brewpub' ]
    },
    {
        name: "FanDraught Sports Brewery",
        location: { lat: 39.552105, lng: -104.773501 },
        type: [ 'Taproom' , 'Brewpub', 'Taphouse' ]
    }
];

// First pass on getting map elements to work.
// TODO: Break up into MV* for use by Knockout
// Initialize the map
var map;
var markers = [];
var centerLat = 39.566631;
var centerLng = -104.872287;

function initMap() {
    "use strict";
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(centerLat, centerLng),
        zoom: 11,
        disableDefaultUI: true
    });
    // Keep map centered on window resize
    google.maps.event.addDomListener(window, 'resize', function() {
        // The following resets to the pre-defined center centered in the map window
        // map.setCenter(new google.maps.LatLng(centerLat, centerLng));
        // map.panTo(new google.maps.LatLng(centerLat, centerLng));
        // The following keeps the currently defined center centered in the map window
        // Thanks to https://gist.github.com/toddmotto/5477991
        var center = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
    });

    // Move the following to the ViewModel
    var breweryInfowindow = new google.maps.InfoWindow();

    for (var i = 0; i < breweryPlaceData.length; i++) {
      var position = breweryPlaceData[i].location;
      var title = breweryPlaceData[i].name;
      var latitude = breweryPlaceData[i].location.lat;
      var longitude = breweryPlaceData[i].location.lng;
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        lat: latitude,
        lng: longitude,
        animation: google.maps.Animation.DROP,
      });
      markers.push(marker);
      marker.addListener('click', function() {
        populateInfoWindow(this, breweryInfowindow);
      });
    };

}

// Function based upon
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // String together all data for info window display
        var infoWindowContent = '<div>' +
        '<h4>' + marker.title + '</h4>' +
        '<p>' + 'Future data points from Yelp and/or Foursquare' + '</p>' +
        '<p><a target="_blank" href="https://www.google.com/maps/dir/Current+Location/' + marker.lat + ',' + marker.lng + '">Directions</a></p>' +
        '</div>';
        infowindow.marker = marker;
        infowindow.setContent(infoWindowContent);
        infowindow.open(map, marker);
        infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
        });
    }
}

/* ---------- Place Constructor ---------- */
// Function to gather and bind data for each brewery
var Place = function(data){
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.type = ko.observable(data.type);
    // Gotta get the marker
    this.marker = ko.observable();
    // Add other data points as investigation in to
    // UnTappd API continues
};

/* ---------- View Model ---------- */
var viewModel = function () {

    var self = this;

    // First, we need to create an empty Knockout observable array of brewery places
    this.breweryList = ko.observableArray([]);

    // Next, create Place objects for all breweryPlaceData listed in the model
    breweryPlaceData.forEach(function(brewery){
        self.breweryList.push( new Place(brewery) );
    });

};

ko.applyBindings(new viewModel());