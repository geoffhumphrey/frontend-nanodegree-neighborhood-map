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
        name: 'Dry Dock Brewing Company - South Dock',
        location: { lat: 39.652665, lng: -104.812040 },
        type: 'Taproom'
    },
    {
        name: 'Copper Kettle Brewing Company',
        location: { lat: 39.692681, lng: -104.891341 },
        type: 'Taproom'
    },
    {
        name: 'Comrade Brewing Company',
        location: { lat: 39.675659, lng: -104.898488 },
        type: 'Taproom'
    },
    {
        name: 'Peak to Peak Tap & Brew',
        location: { lat: 39.674087, lng: -104.793862 },
        type: [ 'Taproom' , 'Brewpub', 'Taphouse' ]
    },
    {
        name: 'Declaration Brewing Company',
        location: { lat: 39.679765, lng: -104.990782 },
        type: 'Taproom'
    },
    {
        name: 'True Brewing Company',
        location: { lat: 39.719919, lng: -104.987686 },
        type: 'Taproom'
    },
    {
        name: 'Living the Dream Brewing',
        location: { lat: 39.540528, lng: -105.039922 },
        type: 'Taproom'
    },
    {
        name: 'Grist Brewing Company',
        location: { lat: 39.549058, lng: -105.033849 },
        type: 'Taproom'
    },
    {
        name: 'Ursula Brewing',
        location: { lat: 39.748301, lng: -104.838031 },
        type: 'Taproom'
    },
    {
        name: 'Launch Pad Brewery',
        location: { lat: 39.700827, lng: -104.789906 },
        type: 'Taproom'
    },
    {
        name: 'Lone Tree Brewing Company',
        location: { lat: 39.562658, lng: -104.892868 },
        type: 'Taproom'
    },
    {
        name: '105 West Brewing Company',
        location: { lat: 39.380952, lng: -104.867617 },
        type: 'Taproom'
    },
    {
        name: 'Locavore Beer Works',
        location: { lat: 39.608641, lng: -105.036131 },
        type: 'Taproom'
    },
    {
        name: '38 State Brewing Company',
        location: { lat: 39.568826, lng: -104.989762 },
        type: 'Taproom'
    },
    {
        name: 'Halfpenny Brewing Company',
        location: { lat: 39.593525, lng: -104.927406 },
        type: 'Taproom'
    },
    {
        name: 'Blue Spruce Brewing Company',
        location: { lat: 39.566910, lng: -104.939904 },
        type: 'BrewPub'
    },
    {
        name: 'Rockyard American Grill and Brewing Company',
        location: { lat: 39.409238, lng: -104.869859 },
        type: 'BrewPub'
    },
    {
        name: 'Breckenridge Brewery Farm House',
        location: { lat: 39.593803, lng: -105.023768 },
        type: 'BrewPub'
    },
    {
        name: 'Dad & Dudes Breweria',
        location: { lat: 39.593947, lng: -104.806407 },
        type: 'BrewPub'
    },
    {
        name: 'Pints Pub Brewery and Freehouse',
        location: { lat: 39.736973, lng: -104.990853 },
        type: 'Brewpub'
    },
    {
        name: 'Vine Street Pub & Brewery',
        location: { lat: 39.743472, lng: -104.961993 },
        type: 'Brewpub'
    },
    {
        name: 'FanDraught Sports Brewery',
        location: { lat: 39.552105, lng: -104.773501 },
        type: 'Brewpub'
    }
];

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
    var marker;

    // First, we need to create an empty Knockout observable array of breweries
    // This will be used to place markers on the map, create InfoWindows, etc.
    self.breweryList = ko.observableArray([]);

    // Then, create another array for the ul list of breweries
    // This will be used to display the full or filtered list based upon userInput
    self.visibleBreweries = ko.observableArray();

    // Next, create Place objects for all breweryPlaceData listed in the model
    breweryPlaceData.forEach(function(brewery){
        self.breweryList.push( new Place(brewery) );
    });

    // Initialize the infoWindow
    // Declaring a single instance of it OUTSIDE of the loop below
    // This results in only one InfoWindow open at a time in the DOM
    // Help: https://stackoverflow.com/questions/24951991/open-only-one-infowindow-at-a-time-google-maps
    var breweryInfowindow = new google.maps.InfoWindow();

    // For each brewery, set the markers and instantiate InfoWindows
    self.breweryList().forEach(function(brewery) {

        // Set the marker
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(brewery.lat(), brewery.lng()),
            map: map,
            animation: google.maps.Animation.DROP
        });
        brewery.marker = marker;

        // TODO: get info from API to populate inside the InfoWindow <div>


        // Add infoWindow Content
        google.maps.event.addListener(brewery.marker,'click',function(){

            // Gather all of the infoWindow content into a variable
            var infoWindowContent = '<div>' +
            '<h4>' + brewery.name() + '</h4>' +
            '<p>' + 'Future data points from Yelp and/or Foursquare' + '</p>' +
            '<p><a target="_blank" href="https://www.google.com/maps/dir/Current+Location/' + brewery.lat() + ',' + brewery.lng() + '">Directions</a></p>' +
            '</div>';

            // Only have the marker bounce animation triggered when a marker or name is clicked
            // All others stop
            if (brewery.marker.getAnimation() !== null) {
              brewery.marker.setAnimation(null);
            } else {
              brewery.marker.setAnimation(google.maps.Animation.BOUNCE);
              // Using setTimeout stops the animation from running continually (and from being annoying)
              // Help: https://discussions.udacity.com/t/how-to-stop-marker-animation-when-the-other-one-is-clicked/229309
              setTimeout(function(){
                brewery.marker.setAnimation(null);
              }, 2100);
            };

            // Set the content of the InfoWindow
            breweryInfowindow.setContent(infoWindowContent);

            // Open the InfoWindow attached to the marker
            breweryInfowindow.open(map, brewery.marker);

            // Move the map view to the marker
            map.panTo(brewery.marker.position);
        });

        // When a user clicks on an item from the sidebar or drop-down list, the marker is shown
        self.showBreweryInfo = function(brewery) {
            google.maps.event.trigger(brewery.marker, 'click');
        };

        // Add brewery information to the visibleBreweries observable array
        // For use in filtering function below
        self.visibleBreweries.push(brewery);

    });

    // Filter breweries based upon user input in either search field
    // Help: https://github.com/lacyjpr/neighborhood/
    // Help: http://codepen.io/prather-mcs/pen/KpjbNN?editors=001

    // Track user input by using the observable method
    // Bind to search text boxes in DOM
    self.userInput = ko.observable('');

    // Define the filter function
    self.filterBreweries = function () {

        // Normalize all input to lowercase
        var input = self.userInput().toLowerCase();

        // Once the function is called, hide markers
        self.visibleBreweries.removeAll();

        // From the breweryList observable array, set visiblity
        self.breweryList().forEach(function (brewery) {
            brewery.marker.setVisible(false);
            if (brewery.name().toLowerCase().indexOf(input) !== -1) {
                self.visibleBreweries.push(brewery);
            }
        });

        self.visibleBreweries().forEach(function (brewery) {
            brewery.marker.setVisible(true);
        });
    };


};

/* ---------- View ---------- */
var map;

// Define the map center upon initial load (County Line Road/I-25)
var centerLat = 39.566631;
var centerLng = -104.872287;

// Initialize the map
function initMap() {
    'use strict';
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(centerLat, centerLng),
        zoom: 11,
        disableDefaultUI: true
    });

    // Keep map centered on window resize
    google.maps.event.addDomListener(window, 'resize', function() {

        // The following keeps the currently defined center centered in the map window
        // Help: https://gist.github.com/toddmotto/5477991
        var center = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);

        // The following resets to the pre-defined center in the map window
        // Not needed since clicking on a brewery name or marker pans to the marker using the panTo method in the VM above
        /*
        map.setCenter(new google.maps.LatLng(centerLat, centerLng));
        map.panTo(new google.maps.LatLng(centerLat, centerLng));
        */
    });

    ko.applyBindings(new viewModel());
};