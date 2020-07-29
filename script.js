
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

function estimatePopularity (trailArray) {
    trailArray.forEach(trail => {
        var voteCount = trail.starVotes;
        var rating = trail.stars;
        var popularity = "";
        if (rating >= 4.5) {
            voteCount += 8;
        } else if (rating > 4) {
            voteCount += 5;
        } else if (rating > 3.5) {
            voteCount += 3;
        }

        if (voteCount < 10) {
            popularity = 1;
        } else if (voteCount < 21) {
            popularity = 2;
        } else if (voteCount < 46) {
            popularity = 3;
        } else if (voteCount < 70) {
            popularity = 4;
        } else {
            popularity = 5
        } 
        console.log(voteCount);
        
        trail.popularity = popularity
        
    });
}



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
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  myLocation.text("Finding trails...");
  myLocation.css("cursor", "not-allowed")
  // hikingAPI(latitude, longitude)

}

function geoError() {
  myLocation.text("Unable to retrieve your location");
  searchField.attr("disabled", false);
  searchDiv.removeClass("loading");
  myLocation.css("cursor", "auto")

}

function userSearch(query) {

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
      //console.log(xhr.status);
    },
    error: function (jqXHR, error, errorThrown) {
      //if error with call
      if (jqXHR.status && jqXHR.status == 400) {
        alert(jqXHR.responseText);
      } else {
        // console.log(xhr.status);
        console.log("Something went wrong: " + jqXHR.status);
      }
    },
  }).then(function (response) {
    if (response.error_message) {
      // If API invalid or response is 200 but google throwns error
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
      myLocation.text("Please enter a city or ZIP code.");
      myLocation.off();
      myLocation.css("cursor", "auto")
    }
  })
}

function searchReset() { // This will need to be addded after the tiles have been generated as well
  myLocation.off()
  myLocation.html("Use my location <i class='fas fa-location-arrow'></i>");
  searchField.val("");
  searchField.attr("disabled", false);
  searchDiv.removeClass("loading");
  myLocation.css("cursor", "pointer")
  myLocation.on("click", getLocation);

}


$(document).ready(function () {

// get current location

myLocation.on("click", getLocation);

// search field
$(".search.link").on("click", function() {
  if (searchField.val()) {
    searchField.attr("disabled", true);
    searchDiv.addClass("loading")
    var query = searchField.val().trim();
    myLocation.text("Finding trails...");
    myLocation.css("cursor", "not-allowed");
    myLocation.off();
    userSearch(query)
  }
  
})
searchField.on("keypress", function (e) {
  if (e.which == 13) {
    $(".search.link").click();
  }
});




// Create tiles here

// after tiles have been created reenable search input
// searchReset()


  // Trail detail modal 
$('.trail-tile').on('click', function() {
// Here we will need to populate the trail modal

  // activate modal
  $('.small.modal')
  .modal('setting', 'transition', 'vertical flip')
  .modal('toggle', 'show-dimmer')
});
});

