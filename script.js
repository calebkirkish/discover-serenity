
var gKey = "AIzaSyDQOySmk8taGDt9pVaSXmNHpO0jjMnQkJ8";

// Make variables that we will use to store trail data global
var trailArray = [];
var result = "";

//global variables/elements
var myLocation = $("#current-location");
var searchField = $("#search-field");
var searchDiv = $("#search-div");
// Trail Class used for creating object
class Trail {
  constructor(
    id,
    name,
    summary,
    difficulty,
    stars,
    starVotes,
    location,
    image,
    trailLength,
    ascent,
    descent,
    longitude,
    latitude,
    conditionStatus
  ) {
    this.id = id;
    this.name = name;
    this.summary = summary;
    this.difficulty = difficulty;
    this.stars = stars;
    this.starVotes = starVotes;
    this.location = location;
    this.image = image;
    this.length = trailLength;
    this.ascent = ascent;
    this.descent = descent;
    this.longitude = longitude;
    this.latitude = latitude;
    this.conditionStatus = conditionStatus;
    this.userImg = image;
    this.covidStatus = "";
    this.county = "";
    this.state = "";
    this.popularity = "";
  }
}

function getTrailData(lat, lon) {
trailArray = [];
  // API Call to Hiking Project
  // Variables for our API call.  Lat, lon, distance will be determined by the end user but are hard-coded for now
var preHikingQueryURL = "https://www.hikingproject.com/data/get-trails?lat=";
// var lat = 47.6062
// var lon = -122.3321
var distance = 100;
var maxResults = 10;
var hikingAPIkey = "200842322-939f54646af26cdd74e5614a1181a8da";
var hikingQueryURL =
  preHikingQueryURL +
  lat +
  "&lon=" +
  lon +
  "&maxDistance=" +
  distance +
  "&maxResults=" +
  maxResults +
  "&key=" +
  hikingAPIkey;

  $.ajax({
    url: hikingQueryURL,
    method: "GET",
  })
    .then(function (response) {
      result = response.trails;

      for (var i = 0; i < result.length; i++) {
        // If a trail is closed, we don't push it to our trail array
        if (result[i].conditionStatus.includes("Closed")) {
          // We won't actually do anything with the variable "x", it's just a placeholder
          var x = 0;
          // If open we push to the trail array
        } else {
          var id = result[i].id;
          var name = result[i].name;
          var summary = result[i].summary;
          var difficulty = result[i].difficulty;
          var stars = result[i].stars;
          var starVotes = result[i].starVotes;
          var location = result[i].location;
          var image = result[i].imgMedium;
          var trailLength = result[i].length;
          var ascent = result[i].ascent;
          var descent = result[i].descent;
          var longitude = result[i].longitude;
          var latitude = result[i].latitude;
          var conditionStatus = result[i].conditionStatus;
          // this puts the image URL in a format that we can use
          image.replace(/\//g, "/");

          // push the result from the JSON object into the Trail object(class), then push that object into the trail Array
          Trail.trailID = result[i].trailID;

          currentTrail = new Trail(
            id,
            name,
            summary,
            difficulty,
            stars,
            starVotes,
            location,
            image,
            trailLength,
            ascent,
            descent,
            longitude,
            latitude,
            conditionStatus
          );
          trailArray.push(currentTrail);

          // var county = getCounty(lat, lon);
        }
      }

      // Set our newly created Trail array to local storage, this is the only way I've found for us to reference the array globally

      // take the latitude and longitude from the hiking project API call and plug them into the getCounty() function
    })
    .then(function () {
      trailArray.forEach((trail) => {
        var lat = trail.latitude;
        var lon = trail.longitude;
        getCounty(lat, lon, trail);
        estimatePopularity(trailArray);

      });

  
    }).then(getCovid).done(function() {
      //create trail tiles here
      // add event listeners after creating tiles
      //populate modals
      searchReset();
    })

    
}

function getCounty(lat, lon, trail) {
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
      // If API invalid or response is 200 but google throws error
      //   console.log(response.error_message);
      alert("Something went wrong with your request.");
    }
    if (response.status === "ZERO_RESULTS") {
      alert("Sorry, we could not find your location");
    }
    var itemState = "";
    var itemCounty = "";
    var components = response.results[0].address_components; //this is an array
    components.forEach((item) => {
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
    });
    trail.county = itemCounty;
    trail.state = itemState;
  });
}


function estimatePopularity(trailArray) {
  trailArray.forEach((trail) => {
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
      popularity = 5;
    }

    trail.popularity = popularity;
  });

}

function getLocation() {
  searchField.val("");
  searchField.attr("disabled", true);
  searchDiv.addClass("loading");
  if (!navigator.geolocation) {
    myLocation.text("Geolocation is not supported by your browser");
  } else {
    myLocation.text("Locating…");
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }
}

function getCovid() {
  // another possible API that seems to be broken https://corona.lmao.ninja/docs/#/Covid-19%20NYT/get_v3_covid_19_nyt_counties
  $.ajax({
      url: "https://covid19-us-api.herokuapp.com/county",
      method: "GET"
  }).then(function (response) {
      response.message.forEach(item => {
        search(item.county_name,item.state_name, trailArray, item);
      });
      // for testing
      // console.log(trailArray)

  })
}

function search(countyKey,stateKey, trailArray, obj) {
  for (var i = 0; i < trailArray.length; i++) {
      if (trailArray[i].county === countyKey && trailArray[i].state === stateKey) {
        // Calculate risk factor .. this still needs refinement

        var cases = obj.new;
        var total = obj.confirmed;
        
        var status = 0;

        if (cases > 100 || total > 1200) {
          status = 3;
        } else if (cases > 80 || total > 800) {
          status = 2;
        } else if (cases > 1 || total){
          status = 1;
        } 
          trailArray[i].covidStatus = status;
      }
  }

}

function geoSuccess(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  myLocation.text("Finding trails...");
  myLocation.css("cursor", "not-allowed");
  getTrailData(latitude, longitude)
}

function geoError() {
  myLocation.text("Unable to retrieve your location");
  searchField.attr("disabled", false);
  searchDiv.removeClass("loading");
  myLocation.css("cursor", "auto");
}

function userSearch(query) {
  var url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    query +
    "&sensor=false&key=" +
    gKey;
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
      // If API invalid or response is 200 but google throws error
      alert("Something went wrong with your request.");
    }
    if (response.status === "ZERO_RESULTS") {
      searchReset();
      myLocation.text(
        "Sorry we could not find " + query + ". Please try another location."
      );
      myLocation.off();
      myLocation.css("cursor", "auto");
    }
    if (
      response.results[0].types[0] === "postal_code" ||
      response.results[0].types[0] === "locality"
    ) {
      var resultObj = response.results[0].geometry.location;
      var lat = resultObj.lat;
      var lon = resultObj.lng;
      var responseLocation = response.results[0].formatted_address;
      myLocation.text("Finding hikes near " + responseLocation + ".");

      getTrailData(lat, lon);
    } else {
      searchReset();
      myLocation.text("Please enter a city or ZIP code.");
      myLocation.off();
      myLocation.css("cursor", "auto");
    }
  });
}

function searchReset() {
  // This will need to be addded after the tiles have been generated as well
  myLocation.off();
  myLocation.html("Use my location <i class='fas fa-location-arrow'></i>");
  searchField.val("");
  searchField.attr("disabled", false);
  searchDiv.removeClass("loading");
  myLocation.css("cursor", "pointer");
  myLocation.on("click", getLocation);
}

$(document).ready(function () {

// Adding class slideShowContainer
$('.page-container').addClass('slideShowContainer');

// Appending images for slideShow
$('.slideShowContainer').append(
  "<ul class='slideShow'>" 
  + "<li><img class='wallpaper' src='img/annette-lake-wa.jpg' alt='Annette Lake WA'/></li>" 
  + "<li><img class='wallpaper' src='img/russian-guich-ca.jpg' alt='Russian Guich CA'/></li>"
  + "<li><img class='wallpaper' src='img/hoh-rain-forest-wa.jpg' alt='Hoh Rain Forest WA'/></li>" 
  + "<li><img class='wallpaper' src='img/twin-falls-wa.jpg' alt='Twin Falls WA'/></li>"
  + "<li><img class='wallpaper' src='img/muir-woods-ca.jpg' alt='Muir Woods CA'/></li>" 
  + "<li><img class='wallpaper' src='img/rattlesnake-ledge-wa.jpg' alt='Rattlesnake Ledge WA'/></li>"
  + "</ul>"
);

// Function slideShow pre-loader
$(function() {
  var slides = $(' .slideShow>li');
  var slideCount = 0;
  var totalSlides = slides.length;
  var slideCache = [];

  (function preLoader() {
    if (slideCount < totalSlides) {
      //Load images
      slideCache[slideCount] = new Image();
      slideCache[slideCount].src = slides.eq(slideCount).find('img').attr('src');
      slideCache[slideCount].onload = function() {
        slideCount++;
        preLoader();
      }
    } else {
      //Run the slideShow
      slideCount = 0;
      slideShow();
    }
  }());

  function slideShow() {
    slides.fadeOut()
    // Run timer and fade in / fade out
    slides.eq(slideCount).fadeIn(1000).delay(2000).fadeOut(1000, function() {
      slideCount < totalSlides - 1 ? slideCount ++ : slideCount = 0;
      slideShow();
    });
  }
});




  // get current location

  myLocation.on("click", getLocation);

  // search field
  $(".search.link").on("click", function () {
    if (searchField.val()) {
      searchField.attr("disabled", true);
      searchDiv.addClass("loading");
      var query = searchField.val().trim();
      myLocation.text("Finding trails...");
      myLocation.css("cursor", "not-allowed");
      myLocation.off();
      userSearch(query);
    }
  });
  searchField.on("keypress", function (e) {
    if (e.which == 13) {
      $(".search.link").click();
    }
  });

  // Create tiles here

  // after tiles have been created re-enable search input
  // searchReset()

  // Trail detail modal
  $(".trail-tile").on("click", function () {
    // Here we will need to populate the trail modal

    // activate modal
    $(".small.modal")
      .modal("setting", "transition", "vertical flip")
      .modal("toggle", "show-dimmer");
  });
});
