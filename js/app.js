// ---------- Model -------------
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd;
}

if (mm<10) {
    mm = '0' + mm;
}

var version = yyyy + mm + dd;

// Foursquare vars
var foursquareCID = 'PEFOBDYIB3ZSYB2EZAIW2BMA0F14OZZCW214UESFUJD0JNUA';
var foursquareSecret = 'RC30SNLRCCFXF3R0YDKW50HCHPRD3MK2S5K10H0HVTFSNC3O';
var foursquareAPI = 'https://api.foursquare.com/v2/venues/search?client_id=' + foursquareCID +
    '&client_secret=' + foursquareSecret + '&v=' + version;

// Google map and street view vars
var googleMapsAPIKey = 'AIzaSyBKeH6OCP82sNs5S2Hn1kI4Xg1uXUkbZPU';
var googleStreetViewURL = 'https://maps.googleapis.com/maps/api/streetview';

// Initial array of breweries in the Denver/Metro area
// TODO: replace this list with a dynamic list via BreweryDB API or UnTappd
// Place Data
// name = brewery name
// lat = latitude
// lng = longitude
// id = google place id
// type = type of establishment (taproom [only serves their brews], brewpub [serves their brews and food])

var breweryPlaceData = [
    {
        name: 'Dry Dock Brewing Company - South Dock',
        location: { lat: 39.652665, lng: -104.812040 },
        type: 'Taproom'
    },
    {
        name: 'Dry Dock Brewing Company - North Dock',
        location: { lat: 39.756624, lng: -104.773515 },
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
        type: 'Brewpub'
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
        type: 'Brewpub'
    },
    {
        name: 'Rockyard American Grill and Brewing Company',
        location: { lat: 39.409238, lng: -104.869859 },
        type: 'Brewpub'
    },
    {
        name: 'Breckenridge Brewery Farm House',
        location: { lat: 39.593803, lng: -105.023768 },
        type: 'Brewpub'
    },
    {
        name: 'Dad & Dudes Breweria',
        location: { lat: 39.593947, lng: -104.806407 },
        type: 'Brewpub'
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
    },
    {
        name: 'CB & Potts - Greenwood Village',
        location: { lat: 39.597370, lng: -104.8895760 },
        type: 'Brewpub'
    },
    {
        name: 'CB & Potts - Highlands Ranch',
        location: { lat: 39.562739, lng: -104.988435 },
        type: 'Brewpub'
    },
];

/* ---------- Place Constructor ---------- */
// Function to gather and bind data for each brewery
var Place = function(data){
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
    this.type = ko.observable(data.type);
    this.marker = ko.observable();
};

var FourSquareConst = function(data){
    this.clientID = ko.observable(data.clientID);
    this.clientSecret = ko.observable(data.clientSecret);
    this.apiURL = ko.observable(data.apiURL);
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

        // Construct the Foursquare API URL
        var foursquareURL =  foursquareAPI +
            '&ll=' + brewery.lat() + ',' + brewery.lng() +
            '&query=\'' + encodeURIComponent(brewery.name()) + '\'' +
            '&limit=1';

        // console.log(foursquareURL);

        // Declare the Foursquare display var
        var foursquareRespDisplay = '';
        var googleStreetViewImage = '';

        // Help: http://api.jquery.com/jquery.getjson/
        $.getJSON( foursquareURL, function(response) {

            console.log('Success: '+ brewery.name());

            // Simplify the response var for sanity's sake
            // Only take the first returned response
            var breweryInfo = response.response.venues[0];

            // Setup vars for brevity and sanity
            var breweryInfoStreet = breweryInfo.location.address;
            var breweryInfoCity = breweryInfo.location.city;
            var breweryInfoState = breweryInfo.location.state;
            var breweryInfoZip = breweryInfo.location.postalCode;
            var breweryInfoPhone = breweryInfo.contact.formattedPhone;
            var breweryInfoFacebook = breweryInfo.contact.facebookUsername;
            var breweryInfoTwitter = breweryInfo.contact.twitter;
            var breweryInfoURL = breweryInfo.url;
            var breweryInfoLat = breweryInfo.location.lat;
            var breweryInfoLng = breweryInfo.location.lng;

            // Fallback to prescribed lat and long if not available via Foursquare
            if (breweryInfoLat === undefined) {
                breweryInfoLat = brewery.lat();
            }

            if (breweryInfoLng === undefined) {
                breweryInfoLng = brewery.lng();
            }

            // Only display complete addresses, otherwise display "incomplete" message
            if ((breweryInfoStreet !== undefined) && (breweryInfoCity !== undefined) && (breweryInfoState !== undefined) && (breweryInfoZip !== undefined)) {
                breweryInfoAddress = breweryInfoStreet + '<br>' + breweryInfoCity + ', ' + breweryInfoState + ' ' + breweryInfoZip;
            }
            else {
                breweryInfoAddress = 'The address for this brewery was incomplete or not found.';
            }

            // Error handle phone number
            if (breweryInfoPhone === undefined) {
                breweryInfoPhone = 'A phone number for this brewery was not found.';
            }

            // Show Facebook icon and link to Facebook page if username is present in profile
            if (breweryInfoFacebook !== undefined) {
                breweryInfoFacebook = ' <a href="https://www.facebook.com/' +
                    breweryInfoFacebook +
                    '" target="_blank" title="Facebook"><span class="fab fa-facebook mr-2"></span></a>';
            }
            else {
                 breweryInfoFacebook = '';
            }

            // Show Twitter icon and link to Facebook page if username is present in profile
            if (breweryInfoTwitter !== undefined) {
                breweryInfoTwitter = ' <a href="https://www.twitter.com/' +
                    breweryInfoTwitter +
                    '" target="_blank" title="Twitter"><span class="fab fa-twitter mr-2"></span></a>';
            }
            else {
                 breweryInfoTwitter = '';
            }

            // Show website icon and link to website if URL is present in profile
            if (breweryInfoURL !== undefined) {
                breweryInfoURL = ' <a href="' +
                    breweryInfoURL +
                    '" target="_blank" title="Website"><span class="fab fa-link"></span></a>';
            }
            else {
                 breweryInfoURL = '';
            }

            // Help make the display of social icons look pretty
            if ((breweryInfoFacebook !== undefined) || (breweryInfoTwitter !== undefined) || (breweryInfoURL !== undefined)) {
                brewerySocialSeperator = '</p><p>';
            }
            else {
                brewerySocialSeperator = '';
            }

            // Concat info to be displayed
            foursquareRespDisplay = '<p>' + breweryInfoAddress + '<br>' +
                breweryInfoPhone + brewerySocialSeperator + breweryInfoFacebook +
                breweryInfoTwitter + breweryInfoURL + '</p>';
            foursquareSuccess = true;

            // Check Google Street View metadata status for lat/lng combo
            // Establish Street View vars
            var googleStreetView = '';

            // Build metadata URL
            var googleStreetViewMetadataURL = googleStreetViewURL + '/metadata?location=' +
                breweryInfoLat + ',' + breweryInfoLng +
                '&size=300x200&key=' + googleMapsAPIKey;

            console.log(googleStreetViewMetadataURL);

            // Get Google Street View metadata JSON and check the status
            $.getJSON(googleStreetViewMetadataURL, function(response) {

                var googleStreetViewMetaStatus = response.status;

                console.log('Metadata Success: '.brewery.name());
                console.log(googleStreetViewMetaStatus);

                // If the status is OK, flag the street view image as good for display
                if (googleStreetViewMetaStatus == 'OK') {
                    googleStreetView = true;
                }

                // All other statuses flag the street view image as NOT good for display
                else {
                    googleStreetView = false;
                }

            })

            // Error handling
            .done(function() {
                console.log('Second Metadata Success: '+ brewery.name());
            })

            .fail(function() {
                console.log('Metadata Error: '+ brewery.name());
                googleStreetView = false;
            })

            .always(function() {
                console.log('Metadata Complete: '+ brewery.name());
            });

            // If image found, generate image tag with properly formed URL
            if (googleStreetView) {
                googleStreetViewImage = '<p><img src="' + googleStreetViewURL + '?' +
                'location=' + breweryInfoLat + ',' + breweryInfoLng +
                '&size=300x200&key=' + googleMapsAPIKey + '"></p>';
                console.log(googleStreetViewImage);
            }

        })

        .done(function() {
            console.log('Second Success: '+ brewery.name());
        })

        .fail(function() {
            console.log('Error: '+ brewery.name());
            foursquareRespDisplay = '<p>Data could not be retrieved from Foursquare.</p>';
            foursquareSuccess = false;
        })

        .always(function() {
            console.log('Complete: '+ brewery.name());
        });

        // Add infoWindow Content
        google.maps.event.addListener(brewery.marker,'click',function(){

            if (foursquareSuccess) {
                foursquareRespDisplay = foursquareRespDisplay + '<p><small><em>Address, phone number and other data provided by <a href="https://foursquare.com" target="_blank">Foursquare</a>.</p>';
            }

            // Gather all of the infoWindow content into a variable
            var infoWindowContent = '<div>' +
            '<h4>' + brewery.name() + '</h4>' +
            '<h6>' + brewery.type() + '</h6>' +
            foursquareRespDisplay +
            googleStreetViewImage +
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
            }

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

        // Display an error message to the user if the map fails to load

    });

    // Put data in alphabetical order by name.
    // TODO: Not exactly sure why this isn't working
    self.visibleBreweries(self.visibleBreweries().sort(function (x, y) {
        if (x.name < y.name) return -1;
        if (x.name > y.name) return 1;
        return 0;
    }));

    self.clearSearchboxes = function () {
        document.getElementById('searchbox-sm-screen').value = "";
        document.getElementById('searchbox-lg-screen').value = "";
    };

    // Filter breweries based upon user input in either search field
    // Help: https://github.com/lacyjpr/neighborhood/
    // Help: http://codepen.io/prather-mcs/pen/KpjbNN?editors=001
    // Track user input by using the observable method
    // Bind to search text boxes in DOM
    self.userInput = ko.observable('');

    // Define the filter function
    self.filterBreweries = function () {

        // Make case-independent by converting all input to lowercase
        var input = self.userInput().toLowerCase();

        // Once the function is instantiated, hide all markers
        self.visibleBreweries.removeAll();

        // Close all open InfoWindows
        breweryInfowindow.close();

        // From the breweryList observable array, add to visibleBreweries array
        self.breweryList().forEach(function (brewery) {
            brewery.marker.setVisible(false);
            if (brewery.name().toLowerCase().indexOf(input) !== -1) {
                self.visibleBreweries.push(brewery);
            }
        });

        // Set visibility of all in visibleBreweries array
        self.visibleBreweries().forEach(function (brewery) {
            brewery.marker.setVisible(true);
        });
    };

    // Function to clear the searchboxes and any infoWindows, resetting to default display
    self.clearForm = function(){

        // Clear any text in the filter textboxes
        self.clearSearchboxes();

        // Remove all brewery data from the array
        self.visibleBreweries.removeAll();

        // Close all open InfoWindows
        breweryInfowindow.close();

        // Put data in alphabetical order by name.
        self.visibleBreweries(self.visibleBreweries().sort(function (x, y) {
            if (x.name < y.name) return -1;
            if (x.name > y.name) return 1;
            return 0;
        }));

        // Re-populate all markers and brewery names on the list
        self.breweryList().forEach(function (brewery) {
            brewery.marker.setVisible(true);
            self.visibleBreweries.push(brewery);
        });

    };

    // Function to toggle views for Taproom Only and Brewpubs Only buttons
    self.toggleButton = function(type) {

        // Once the function is called, hide markers
        self.visibleBreweries.removeAll();

        // Close all open InfoWindows
        breweryInfowindow.close();

        // Clear any text in the filter textboxes
        self.clearSearchboxes();

        // From the breweryList observable array, add to visibleBreweries array
        self.breweryList().forEach(function (brewery) {
            brewery.marker.setVisible(false);
            if (brewery.type() === type) {
                self.visibleBreweries.push(brewery);
            }
            else if (type === 'All') {
                self.visibleBreweries.push(brewery);
            }
        });

        // Set visibility of all in visibleBreweries array
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
    // Error handling for map load failure
    try {
        map = new google.maps.Map(document.getElementById('map'), {
            center: new google.maps.LatLng(centerLat, centerLng),
            zoom: 11,
            disableDefaultUI: true
        });
    } catch (err) {
        alert('Google Map load failure. Please check your internet connection!');
    }

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
}