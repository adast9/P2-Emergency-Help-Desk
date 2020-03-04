// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow, marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        //center: {lat: -34.397, lng: 150.644},
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;

    // This event listener will call addMarker() when the map is clicked.
    map.addListener('click', function(event) {
        placeMarker(event.latLng);
    });

    var geocoder = new google.maps.Geocoder();
    document.getElementById('address').addEventListener('keydown', function(event) {
        //Checks if Enter key was pressed so search bar works without having to click "Search" button
        if (event && event.keyCode == 13)
            geocodeAddress(geocoder, map);
    });
    document.getElementById('search').addEventListener('click', function() {
        geocodeAddress(geocoder, map);
    });
    document.getElementById('gps').addEventListener('click', function() {
        gps();
    });
    document.getElementById('submit').addEventListener('click', function() {
        sendEmergency();
    });

    gps();
}

function placeMarker(location) {
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

        marker.addListener('click', function() {
            map.setZoom(map.getZoom() + 2);
            map.setCenter(marker.getPosition());
        });
    }
}

function gps() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            placeMarker(pos);
            map.setZoom(16);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function sendEmergency() {
    document.getElementById('address').value = "";
    document.getElementById('desc').value = "";
    alert("Your request has been submitted.");
}

function geocodeAddress(geocoder, resultsMap) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address}, function(results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            placeMarker(results[0].geometry.location);
            map.setZoom(16);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 
       'Error: The Geolocation service failed.' : 
       'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

const handleSuccess = function(stream) {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(1024, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
        // Do something with the data, e.g. convert it to WAV
        console.log(e.inputBuffer);
    };
};

navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess);