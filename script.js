
var gKey = "AIzaSyDQOySmk8taGDt9pVaSXmNHpO0jjMnQkJ8";

// Make variables that we will use to store trail data global
var trailArray = [];
var result = "";

//global variables/elements
var myLocation = $("#current-location");
var searchField = $("#search-field");
var searchDiv = $("#search-div");

var riskL1 = "<span class='fas fa-circle checked icon'></span><span class='fas fa-circle icon'></span><span class='fas fa-circle icon'></span>";
var riskL2 = "<span class='fas fa-circle checked icon'></span><span class='fas fa-circle checked icon'></span><span class='fas fa-circle icon'></span>";
var riskL3 = "<span class='fas fa-circle checked icon'></span><span class='fas fa-circle checked icon'></span><span class='fas fa-circle checked icon'></span>"

var popL1 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span>"
var popL2 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span>"
var popL3 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span>"
var popL4 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking icon'></span>"
var popL5 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span>"

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
    conditionStatus,
    url
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
    this.url = url;
    this.userImg = image;
    this.covidStatus = "";
    this.county = "";
    this.state = "";
    this.popularity = "";
  }
}

function getTrailData(lat, lon) {
  $("#two").empty();
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
          var url = result[i].url
          // this puts the image URL in a format that we can use
          image.replace(/\//g, "/");
          if (!image) {
            image = "./150.png"
          }
          url.replace(/\//g, "/");

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
            conditionStatus,
            url
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
        // console.log(result);
        // trail.county = result.currentCounty;
        // trail.state = result.currentState;
      });

      // Here we need another .then for covid data function that passes in the trailArray. Within the covid function it will make one API call for the state (if there are multiple states it will need to handle that with another call)
      // foreach trail it will look at the trail.county and then search the stateData array for that county and add the applicable covid risk to that trail. Will need to write an error that will display unknown if the code

      // this will be followed by a .done function that creates tiles for the trail data

      console.log(trailArray);
      

      // all code can go here after AJAX calls

  
    }).done(function(){
      populateTiles();
      searchReset();
      $(".trail-tile").on("click", function () {
             //modal date removal
      $("#covid-rating").empty();
      $("#pop-rating").empty();
        // Here we will need to populate the trail modal
        var id = $(this).attr("data-trailid");
        console.log(id)
        var targetTrail = trailArray.find(item => item.id == id);
        console.log(targetTrail) 
        $("#modal-name").text(targetTrail.name);
    
        $(".status").text(targetTrail.conditionStatus);
    
        if (targetTrail.covidStatus === 3) {
          $("#covid-rating").append(riskL3)
        } else if (targetTrail.covidStatus === 2) {
          $("#covid-rating").append(riskL2)
        } else {
          $("#covid-rating").append(riskL1)
        }
    
        if (targetTrail.popularity === 1) {
          $("#pop-rating").append(popL1)
        } else if (targetTrail.popularity === 2){
          $("#pop-rating").append(popL2)
        } else if(targetTrail.popularity === 3){
          $("#pop-rating").append(popL3)
        } else if(targetTrail.popularity === 4){
          $("#pop-rating").append(popL4)
        } else {
          $("#pop-rating").append(popL5)
        }
       
        $("#difficulty").text(targetTrail.difficulty);
        $("#location").text(targetTrail.county + " County, " + targetTrail.state);
        $("#summary").text(targetTrail.summary);
        $("#more-info").attr("href", targetTrail.url);
        $("#modal-image").attr("src", targetTrail.image);
    
        // activate modal
        $(".small.modal")
          .modal("setting", "transition", "vertical flip")
          .modal("toggle", "show-dimmer");
      });
    })

    
  // Parse our new local storage item so that it can be referenced
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
      // If API invalid or response is 200 but google throwns error
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

function populateTiles() {
  
    
  for (var i = 0; i < trailArray.length; i++){
    console.log(trailArray[i])

    var trailTile = $("<div class='trail-tile'>");
    var imgBox = $("<div class='img-box'>");
    var trailImg = $("<img class='trail-img'>");
    var trailName = $("<h4 class='trail-name'>");
    var county = trailArray[i].county;
    console.log(county)
    $(trailName).text(trailArray[i].name)
    var trailInfo = $("<div class='trail-info'>");
    var pStatus = $("<p>");
    var spanStatus = $("<span class='status'>");
    var riskRatingP = $("<p class='risk-rating'>").text("Covid-19 factor: ");
    var circleChecked = $("<span class='fas fa-circle checked icon'>");
    var circleBlanked = $("<span class='fas fa-circle icon'>");
    var popularityRating = $("<p class='popularity'>").text("Popularity: ");
    var hikingCheck = $("<span class='fas fa-hiking checked icon'>");
    var hikingBlanked = $("<span class='fas fa-hiking icon'>");
    var countyP = $("<p>");
    var countySpan = $("<span class='county'>");

    $("#two").append(trailTile);
    $(trailTile).append(imgBox);
    $(trailTile).attr("data-trailid", trailArray[i].id)
    $(imgBox).append(trailImg);
    $(trailImg).attr("src", trailArray[i].image)
    $(trailTile).append(trailName);
    $(trailTile).append(trailInfo);
    $(trailInfo).append(pStatus);
    $(pStatus).append(spanStatus);
    $(trailInfo).append(riskRatingP);
    if (trailArray[i].covidStatus === 3) {
      $(riskRatingP).append(riskL3)
    } else if (trailArray[i].covidStatus === 2) {
      $(riskRatingP).append(riskL2)
    } else {
      console.log(trailArray[i].covidStatus)
      $(riskRatingP).append(riskL1)
    }
    
    $(trailInfo).append(popularityRating);

    if(trailArray[i].popularity === 1) {
      $(popularityRating).append(popL1)
    } else if (trailArray[i].popularity === 2){
      $(popularityRating).append(popL2)
    } else if(trailArray[i].popularity === 3){
      $(popularityRating).append(popL3)
    } else if(trailArray[i].popularity === 4){
      $(popularityRating).append(popL4)
    } else {
      $(popularityRating).append(popL5)
    }

    $(trailInfo).append(countyP)
    $(countyP).text("County: ");
    $(countyP).append(countySpan);
    $(countySpan).text(county);
  }

}

$(document).ready(function () {
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

  // after tiles have been created reenable search input
  // searchReset()

  // Trail detail modal
  // $(".trail-tile").on("click", function () {
  //   // Here we will need to populate the trail modal
  //   var id = $(this).attr("data-trailid");
  //   console.log(id)
  //   var targetTrail = trailArray.find(item => item.id == id);
  //   console.log(targetTrail) 
  //   $("#modal-name").text(targetTrail.name);

  //   $(".status").text(targetTrail.conditionStatus);

  //   if (targetTrail.covidStatus === 3) {
  //     $("#covid-rating").append(riskL3)
  //   } else if (targetTrail.covidStatus === 2) {
  //     $("#covid-rating").append(riskL2)
  //   } else {
  //     $("#covid-rating").append(riskL1)
  //   }

  //   if (targetTrail.popularity === 1) {
  //     $("#pop-rating").append(popL1)
  //   } else if (targetTrail.popularity === 2){
  //     $("#pop-rating").append(popL2)
  //   } else if(targetTrail.popularity === 3){
  //     $("#pop-rating").append(popL3)
  //   } else if(targetTrail.popularity === 4){
  //     $("#pop-rating").append(popL4)
  //   } else {
  //     $("#pop-rating").append(popL5)
  //   }
   
  //   $("#difficulty").text(targetTrail.difficulty);
  //   $("#location").text(targetTrail.county + " County, " + targetTrail.state);
  //   $("#summary").text(targetTrail.summary);
  //   $("#more-info").attr("href", targetTrail.url);
  //   $("#modal-image").attr("src", targetTrail.image);

  //   // activate modal
  //   $(".small.modal")
  //     .modal("setting", "transition", "vertical flip")
  //     .modal("toggle", "show-dimmer");
  // });
});
