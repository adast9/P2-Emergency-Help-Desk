let map, infoWindow, marker, markerPosition;
const searchBar = document.getElementById('address');
const searchButton = document.getElementById('search');
const gpsButton = document.getElementById('gps');
const submitButton = document.getElementById('submit')

function InitMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 56.2, lng: 10.3333283},
        zoom: 7,
        tilt: 0
    });
    infoWindow = new google.maps.InfoWindow;

    // This event listener will place the marker when the map is clicked.
    map.addListener('click', function(event) {
        markerPosition = event.latLng;
        PlaceMarker(event.latLng);
    });

    let noPoi = [{
        featureType: "poi",
        stylers: [{visibility: "off"}]   
    }];
    map.setOptions({styles: noPoi});

    let geocoder = new google.maps.Geocoder();
    searchBar.addEventListener('keydown', function(event) {
        //Checks if Enter key was pressed so search bar works without having to click "Search" button
        if (event && event.keyCode == 13)
            Search(geocoder, map);
    });

    searchButton.addEventListener('click', function(){ Search(geocoder, map); });
    gpsButton.addEventListener('click', function(){ Geolocate(); });
    submitButton.addEventListener('click', function(){ SubmitEmergency(); });

    Geolocate();
}

function PlaceMarker(location) {
    if(marker) {
        marker.setPosition(location);
        marker.setAnimation(google.maps.Animation.DROP);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        //Zoom in map and center map on marker when it is clicked
        /*marker.addListener('click', function() {
            map.setZoom(map.getZoom() + 2);
            map.setCenter(marker.getPosition());
        });*/
    }
}

function Geolocate() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
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
        // Browser doesn't support Geolocation
        HandleLocationError(false, infoWindow, map.getCenter());
    }
}

function SubmitEmergency() {
    if(marker) {
        document.getElementById('address').value = "";
        document.getElementById('desc').value = "";
        alert("Your request has been submitted.");
    } else {
        alert("You need to mark your location on the map.");
    }
}

function Search(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
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