let autocomplete;
let name;
let long;
let lat;
let coords = {
    table: []
};
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
        coords.table.push({lat: lat, long: long});
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
function writeToJson() {
    var json = JSON.stringify(coords);
    var fs = require('fs');
    fs.writeFile('myjsonfile.json', json, 'utf8', callback);
    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
            coords = JSON.parse(data); //now it an object
            coords.table.push({id: 2, square:3}); //add some data
            json = JSON.stringify(coords); //convert it back to json
            fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back
        }});
}