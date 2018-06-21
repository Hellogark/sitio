

var map,bounds,marker;
var  miLatlng={
    lat:0,
    lng:0
};

function initMap() {

    mapCenter= new google.maps.LatLng(25.792806,-108.990188);
    geocoder = new google.maps.Geocoder();
    var mapOptions = {
        center: mapCenter,
        minZoom: 15,
        zoom: 16,
    }
     map = new google.maps.Map(document.getElementById('map'), mapOptions);
    bounds = new google.maps.LatLngBounds(

            new google.maps.LatLng(25.819837, -108.950203),
            new google.maps.LatLng(25.775530, -109.047040)

    );
    $('#carta').hide();

}

function error(err) {
    alert("Unable to find current location");
    
}
function currPos(position) {
     miLatlng.lat=position.coords.latitude;
     miLatlng.lng=position.coords.longitude;
    map.setCenter(miLatlng);
    map.panTo(miLatlng);
    var centro = map.getCenter();

     }
    function success(position) {
        currPos(position);
        watchPos();

    }


    // Browser doesn't support Geolocation


    function watchPos() {
        var infoWindow = new google.maps.InfoWindow({map: map});

        var positionTimer = navigator.geolocation.watchPosition(
            function () {

                infoWindow.setPosition(miLatlng);
                console.log(miLatlng);

                infoWindow.setContent('Posición Actual');


            });


    }



    var options = {
        enableHighAccuracy: true,
        timeout: 8500,
        maximumAge: Infinity,
        delay: 1000
    };

    function initLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error, options);

        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }


    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    }


function codeAddress(address,position) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);			// center the map on address
                marker = new google.maps.Marker({					// place a marker on the map at the address
                    map: map,
                    position: results[0].geometry.location,

                });
                marker.addListener('click', function () {
                    let lat = this.position.lat();
                    let lon = this.position.lng();
                    var geocoder = new google.maps.Geocoder;
                    geocode(geocoder, map, marker, lat, lon);
                    let goCords = marker.getPosition();
                    var directionsDisplay = new google.maps.DirectionsRenderer;
                    var directionsService = new google.maps.DirectionsService;
                    calculateAndDisplayRoute(directionsService, directionsDisplay,miLatlng, goCords,marker);
                    directionsDisplay.setMap(map);

                    /* var positionTimer = navigator.geolocation.watchPosition(
                         function (position) {

                             position = new google.maps.LatLng(position.coords.latitude,
                                 position.coords.longitude);
                         });
                     getDirections(positionTimer,cords);
                 });*/

                } )} else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });

    }

function calculateAndDisplayRoute(directionsService, directionsDisplay,position,goTo) {
    directionsService.route({
        origin: position,
        destination: goTo,
        travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}





function geocode(geocoder,map,marker,latitud,longitud) {
        var latLong= new google.maps.LatLng(latitud,longitud);
        geocoder.geocode({'location':latLong}, function (results,status) {
            if(status==='OK'){
                var direccion=results[0].formatted_address;
                obtenerImagen(direccion);

            }
            
        })
}

    // setup initial map
    $(document).ready(function () {
        initMap();

        if (navigator.geolocation) {
            initLocation();
        }
        $("#map-address-btn").click(function (event) {
            event.preventDefault();
            var address = $("#direccion").val();					// grab the address from the input field
            codeAddress(address+"Los Mochis, Sinaloa");										// geocode the address
        });
    });



    function obtenerImagen(direccion) {
        var add = direccion;
        var addressUrl
        addressUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x300&fov:20&location=' + add + '&key=AIzaSyD95Jktpsij3qo6QOlXq3OHN41hQvPKoz4';
        $('#imagen').attr("src", "");
        $('#imagen').attr("src", addressUrl);
        $('#carta').show();

    }


