
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
  $(".slideShow").empty()
  $("#two").empty();
  trailArray = [];
  var preHikingQueryURL = "https://www.hikingproject.com/data/get-trails?lat=";
  var distance = 70;
  var maxResults = 50;
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

        var difficulty = "";

        switch (result[i].difficulty) {
          case "green":
            difficulty = "Easy"
            break;
          case "greenBlue":
            difficulty = "Mild"
            break;
          case "blue":
            difficulty = "Moderate"
            break;
          case "blueBlack":
            difficulty = "Challenging"
            break;
          case "black":
            difficulty = "Hard"
            break;
          case "dblack":
            difficulty = "Very hard"
            break;
          default:
            difficulty = result[i].difficulty
            break;
        }


        // If a trail is closed, we don't push it to our trail array
        if (result[i].conditionStatus.includes("Closed")) {
          // We won't actually do anything with the variable "x", it's just a placeholder
          var x = 0;
          // If open we push to the trail array
        } else {
          var id = result[i].id;
          var name = result[i].name;
          var summary = result[i].summary;
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

          image.replace(/\//g, "/");
          if (!image) {
            image = "img/fallback-img.jpg"
          }
          url.replace(/\//g, "/");

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

        }
      }

    })
    .then(function () {
      
        getCounty();
        estimatePopularity();


  
    }).then(getCovid).then(function(){
      setTimeout(function() {
        // fallback incase a county was not found
        trailArray.forEach((trail) => {
          if (!trail.county) {
            trailArray = trailArray.filter(item => item !== trail)
          }
          // filter out trails that are probably not day hikes (future feature would be to allow user to choose this)
          if (trail.length > 15) {
            trailArray = trailArray.filter(item => item !== trail)
          }
        })
        populateTiles()
        searchReset();
        $(".trail-tile").on("click", modalData)
      }, 3000)
      
      function modalData() {
        $("#covid-rating").empty();
        $("#pop-rating").empty();

        var id = $(this).attr("data-trailid");
        var targetTrail = trailArray.find(item => item.id == id);
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
          $("#length").text(targetTrail.length)
      
          // activate modal
          $(".small.modal")
            .modal("setting", "transition", "vertical flip")
            .modal("toggle", "show-dimmer");
      };
    
    })

    
}

function getCounty() {
  trailArray.forEach((trail) => {
    var lat = trail.latitude;
    var lon = trail.longitude;
  var queryLocation = lat + ", " + lon;
  var url =
    "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
    queryLocation +
    "&sensor=false&key=" +
    gKey;
  $.ajax({
    method: "GET",
    url: url,
    error: function (jqXHR) {
      if (jqXHR.status && jqXHR.status == 400) {
        myLocation.text("Uh-oh! Something went wrong!");
      } else {
        myLocation.text("Oh no! Something's broken with " + trail + "! Status: " + jqXHR.status);
      }
    },
  }).then(function (response) {
    if (response.error_message) {
      myLocation.text("Sorry. We had a problem finding your trails.");
    }
    if (response.status === "ZERO_RESULTS") {
      myLocation.text("No results for your location.");
    }
    var itemState = "";
    var itemCounty = "";
    for (var i = 0; i < response.results.length; i++) {
      searchAddress(i)
    }

    
    function searchAddress(i) {
      var components = response.results[i].address_components; 
      components.forEach((item) => {
        var checkItem = item.types[0];
        if (checkItem === "administrative_area_level_1") {
          itemState = item.long_name;
        }
        if (checkItem === "administrative_area_level_2") {
          itemCounty = item.long_name;
          itemCounty = itemCounty.replace("County", "").trim();
        }
        
      });
    }
    trail.county = itemCounty;
    trail.state = itemState;
  });
})
}

function estimatePopularity() {
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

  trailArray.sort(trailSort)
}

function trailSort(a, b) {
  var trailPopA = a.popularity;
  var trailPopB = b.popularity;

  let comparison = 0;
  if (trailPopA < trailPopB) {
    comparison = -1;
  } else if (trailPopA > trailPopB) {
    comparison = 1;
  }
  return comparison;
}


function getCovid() {
  $.ajax({
      url: "https://covid19-us-api.herokuapp.com/county",
      method: "GET"
  }).then(function (response) {
      response.message.forEach(item => {
        search(item.county_name,item.state_name, trailArray, item);
      });
  })
}

function search(countyKey,stateKey, trailArray, obj) {
  for (var i = 0; i < trailArray.length; i++) {
      if (trailArray[i].county === countyKey && trailArray[i].state === stateKey) {

        var cases = obj.new;
        var total = obj.confirmed;
        
        var status = 0;

        if (cases > 100 || total > 3000) {
          status = 3;
        } else if (cases > 80 || total > 1200) {
          status = 2;
        } else if (cases > 1 || total){
          status = 1;
        } 
          trailArray[i].covidStatus = status;
      }
  }

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
  $.ajax({
    method: "GET",
    url: url,
    error: function (jqXHR) {
      if (jqXHR.status && jqXHR.status == 400) {
        myLocation.text("Uh-oh! Something went wrong!");
      } else {
        myLocation.text("Oh no! Something's broken! Status: " + jqXHR.status);
      }
    },
  }).then(function (response) {
    if (response.error_message) {
      myLocation.text("Sorry. We had a problem finding the location.");
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

    var trailTile = $("<div class='trail-tile'>");
    var imgBox = $("<div class='img-box'>");
    var trailImg = $("<img class='trail-img'>");
    var trailName = $("<h4 class='trail-name'>");
    var county = trailArray[i].county;
    $(trailName).text(trailArray[i].name)
    var trailInfo = $("<div class='trail-info'>");
    var pStatus = $("<p>");
    var riskRatingP = $("<p class='risk-rating'>").text("Covid-19 factor: ");
    var popularityRating = $("<p class='popularity'>").text("Popularity: ");
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
    $(trailInfo).append(riskRatingP);
    if (trailArray[i].covidStatus === 3) {
      $(riskRatingP).append(riskL3)
    } else if (trailArray[i].covidStatus === 2) {
      $(riskRatingP).append(riskL2)
    } else {
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

  
});
