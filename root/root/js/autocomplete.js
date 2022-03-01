let autocomplete;
let name;
let long;
let lat;
window.initAutocomplete = function() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete'),
        {
            types: ['geocode'],
            componentRestrictions: {'country' : ['CA']},
            fields: ['place_id', 'geometry', 'name']
        });
    autocomplete.addListener('place_changed', onPlaceChanged);
}

function onPlaceChanged() {
    // get info on place selected
    var place = autocomplete.getPlace();

    if (!place.geometry) {
        // User did not select a prediction; reset the input field
        document.getElementById('autocomplete').placeholder = 'Enter a place';
    } else {
        // Display details about the valid place
        // document.getElementById('details').innerHTML = place.name;
        name = place.name;
        lat = place.geometry.location.lat();
        long = place.geometry.location.lng();
    }
}

function getLat() {
    return lat;
}

function getLong() {
    return long;
}

function getPlaceName() {
    return name;
}