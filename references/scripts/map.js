// The map script used on the public side.

// Center the map on Denmark :).
const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 56.2, lng: 10.3333283},
    zoom: 7,
    tilt: 0
});
// Hides shops, businesses, etc on the map.
const noPoi = [{
    featureType: "poi",
    stylers: [{visibility: "off"}]
}];
map.setOptions({styles: noPoi});

// Place/update the map marker when the map is clicked.
map.addListener('click', function(event) {
    PlaceMarker(event.latLng);
});
// Used in geolocation.
const infoWindow = new google.maps.InfoWindow;

// For searching google maps.
const geocoder = new google.maps.Geocoder();
let marker;

const searchBar = document.getElementById('address');
searchBar.addEventListener('keydown', function(event) {
    // For using the searh bar with the Enter key.
    if (event && event.keyCode == 13)
        Search(geocoder, map);
});

const searchButton = document.getElementById('search');
searchButton.addEventListener('click', function(){ Search(geocoder, map); });

const gpsButton = document.getElementById('gps');
gpsButton.addEventListener('click', function(){ Geolocate(); });

Geolocate();

// Place/move the map marker. 
function PlaceMarker(location) {
    if(marker) {
        // Marker already exists, so move it to the new location.
        marker.setPosition(location);
        marker.setAnimation(google.maps.Animation.DROP);
    } else {
        // Create the marker at the location.
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
    }
}

// Uses HTML5 geolocation to try to locate the user automatically.
function Geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            PlaceMarker(pos);
            map.setZoom(16);
            map.setCenter(pos);
        }, function() {
            HandleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support geolocation.
        HandleLocationError(false, infoWindow, map.getCenter());
    }
}

// Search google maps.
function Search(geocoder, resultsMap) {
    geocoder.geocode({'address': searchBar.value}, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            PlaceMarker(results[0].geometry.location);
            map.setZoom(16);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function HandleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
       'Error: The Geolocation service failed.' :
       'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}