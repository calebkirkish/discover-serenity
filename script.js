
// Google Maps:  Still need to research to find query URL, etc.

// Trail detail modal
$('.trail-tile').on('click', function() {
  $('.small.modal')
  .modal('setting', 'transition', 'vertical flip')
  .modal('toggle', 'show-dimmer')
});

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


