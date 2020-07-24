// Google Maps:  Still need to research to find query URL, etc.

// API Key:

var gKey = "AIzaSyDQOySmk8taGDt9pVaSXmNHpO0jjMnQkJ8";

function getCounty(lat, lon) {
  var queryLocation = lat + ", " + lon;
  var url =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    queryLocation +
    "&sensor=false&key=" +
    gKey;
  console.log(url);
  $.ajax({
    method: "GET",
    url: url,
  }).then(function (response) {
    console.log(response);
    var components = response.results[0].address_components; //this is an array
    components.forEach((item) => {
      var itemState = "";
      var itemCounty = "";
      var checkItem = item.types[0];
      if (checkItem === "administrative_area_level_1") {
        itemState = item.long_name;
        console.log(itemState);
      }
      if (checkItem === "administrative_area_level_2") {
        itemCounty = item.long_name;
        console.log(itemCounty);
      }
    });
  });
}

getCounty(47.487983, -121.723172);
