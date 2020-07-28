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
  //   console.log(url);
  $.ajax({
    method: "GET",
    url: url,
    complete: function (xhr, statusText) {
      //confirms success
      //   console.log(xhr.status);
    },
    error: function (jqXHR, error, errorThrown) {
      //if error with call
      if (jqXHR.status && jqXHR.status == 400) {
        alert(jqXHR.responseText);
      } else {
        // console.log(xhr.status);
        alert("Something went wrong: " + jqXHR.status);
      }
    },
  }).then(function (response) {
    // console.log(response);
    if (response.error_message) {
      // If API invalid or response is 200 but google throwns error
      //   console.log(response.error_message);
      alert("Something went wrong with your request.");
    }
    if (response.status === "ZERO_RESULTS") {
      alert("Sorry, we could not find your location");
    }
    var components = response.results[0].address_components; //this is an array
    components.forEach((item) => {
      var itemState = "";
      var itemCounty = "";
      var checkItem = item.types[0];
      if (checkItem === "administrative_area_level_1") {
        itemState = item.long_name;
        // console.log(itemState);
      }
      if (checkItem === "administrative_area_level_2") {
        itemCounty = item.long_name;
        itemCounty = itemCounty.replace("County", "").trim();
        // console.log(itemCounty);
      }
      var result = {
        state: itemState,
        county: itemCounty,
      };
      return result;
    });
  });
}

// Test cases
// getCounty(0, 0);
// getCounty(47.487983, -121.723172);

//global variables/elements
var myLocation = $("#current-location");
var searchField = $("#search-field");
var searchDiv = $("#search-div");

function getLocation() {
  searchField.val("");
  searchField.attr("disabled", true);
  searchDiv.addClass("loading")
  if (!navigator.geolocation) {
    myLocation.text("Geolocation is not supported by your browser");
  } else {
    myLocation.text("Locating…");
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }
}

function geoSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  myLocation.text("Finding trails...");
  myLocation.css("cursor", "not-allowed")

  console.log(latitude + ", " + longitude);
  // hikingAPI(latitude, longitude)

}

function geoError() {
  myLocation.text("Unable to retrieve your location");
  searchField.attr("disabled", true);
  searchDiv.removeClass("loading");
  myLocation.css("cursor", "auto")

}

function userSearch(query) {
  // https://maps.googleapis.com/maps/api/geocode/json?&address=98038&key=AIzaSyDQOySmk8taGDt9pVaSXmNHpO0jjMnQkJ8
  var url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    query +
    "&sensor=false&key=" +
    gKey;
    console.log(url);
  $.ajax({
    method: "GET",
    url: url,
    complete: function (xhr, statusText) {
      //confirms success
      //   console.log(xhr.status);
    },
    error: function (jqXHR, error, errorThrown) {
      //if error with call
      if (jqXHR.status && jqXHR.status == 400) {
        alert(jqXHR.responseText);
      } else {
        // console.log(xhr.status);
        alert("Something went wrong: " + jqXHR.status);
      }
    },
  }).then(function (response) {
    console.log(response);
    if (response.error_message) {
      // If API invalid or response is 200 but google throwns error
      //   console.log(response.error_message);
      alert("Something went wrong with your request.");
    }
    if (response.status === "ZERO_RESULTS") {
      searchReset();
      myLocation.text("Sorry we could not find " + query + ". Please try another location.");
      myLocation.off();
      myLocation.css("cursor", "auto")
    }
    if (response.results[0].types[0] === "postal_code" || response.results[0].types[0] === "locality") {
      var resultObj = response.results[0].geometry.location;
      var lat = resultObj.lat;
      var lon = resultObj.lng;
      var responseLocation = response.results[0].formatted_address
      myLocation.text("Finding hikes near " + responseLocation + ".");
  
      // hikingAPI(lat, lon)
    } else {
      searchReset();
      myLocation.text("Sorry we could not find " + query + ". Please try another location.");
      myLocation.off();
      myLocation.css("cursor", "auto")
    }
  })
}

function searchReset() { // This will need to be addded after a search has been executed/failed
  myLocation.off()
  myLocation.html("Use my location <i class='fas fa-location-arrow'></i>");
  searchField.val("");
  searchField.attr("disabled", false);
  searchDiv.removeClass("loading");
  myLocation.css("cursor", "pointer")
  myLocation.on("click", getLocation);

}


$(document).ready(function () {


// User input
// disable input and add class loading on click

// get current location

myLocation.on("click", getLocation);

// search field

$(".search.link").on("click", function() {
  searchField.attr("disabled", true);
  searchDiv.addClass("loading")
  var query = searchField.val().trim();
  myLocation.text("Finding trails...");
  myLocation.css("cursor", "not-allowed");
  myLocation.off();
  // searchField.val("");
  userSearch(query)
})
searchField.on("keypress", function (e) {
  if (e.which == 13) {
    $(".search.link").click();
  }
});




// Create tiles here

// after tiles have been created reenable search input


  // Trail detail modal 
$('.trail-tile').on('click', function() {
// Here we will need to populate the trail modal

  // activate modal
  $('.small.modal')
  .modal('setting', 'transition', 'vertical flip')
  .modal('toggle', 'show-dimmer')
});
});