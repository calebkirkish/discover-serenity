// Google Maps:  Still need to research to find query URL, etc.

// API Key:

var gKey = "AIzaSyDQOySmk8taGDt9pVaSXmNHpO0jjMnQkJ8";


function getCounty(lat, lon) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=47.487983, -121.723172&sensor=false&key=" + gKey
    $.ajax({
        method: "GET",
        url: url
    }).then(function(response) {
        console.log(response)
        // in this retunred object I will need to access the administrative_area_level_2 === county
    });
}


getCounty(1,2)
