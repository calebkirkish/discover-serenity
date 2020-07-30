
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
        // console.log(result);
        // trail.county = result.currentCounty;
        // trail.state = result.currentState;
      });

      // Here we need another .then for covid data function that passes in the trailArray. Within the covid function it will make one API call for the state (if there are multiple states it will need to handle that with another call)
      // foreach trail it will look at the trail.county and then search the stateData array for that county and add the applicable covid risk to that trail. Will need to write an error that will display unknown if the code

      // this will be followed by a .done function that creates tiles for the trail data

      console.log(trailArray);

      // all code can go here after AJAX calls

  
    });

    
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

function getCovid(county, state) {
  // another possible API that seems to be broken https://corona.lmao.ninja/docs/#/Covid-19%20NYT/get_v3_covid_19_nyt_counties
  console.log("string")
  $.ajax({
      url: "https://covid19-us-api.herokuapp.com/county",
      method: "GET"
  }).then(function (response) {
      var stateData = [];
      var countyCount = 0;
      var stateCount = 0;
      response.message.forEach(item => {
        search(item.county_name,item.state_name, exampleArray, item);
          if (item.state_name === state) {
              var data = {
                  county: item.county_name,
                  newCases: item.new,
              }
              stateData.push(data)
              console.log(data);
          }
      });
      stateData.forEach(item => {
          if (item.county === county) {
              countyCount = item.newCases;
          }
          stateCount += item.newCases;
      })
      response.message.forEach(item => {
      });
      console.log(stateCount);
      


      // add up all the data to the state and divide it by all the counties on the list
      // search list for the specific counties
      var covidRisk = (stateCount / stateData.length) + countyCount;
      console.log(covidRisk);
      console.log(exampleArray)

  })
}
getCovid("Cleburne", "Alabama");


function search(countyKey,stateKey, exampleArray, obj) {
  for (var i = 0; i < exampleArray.length; i++) {
      if (exampleArray[i].county === countyKey && exampleArray[i].state === stateKey) {
        var percentNew = Math.round((obj.new + 1) / obj.confirmed * 100);
      
        var status = 0;
        if (obj.new > 100 || percentNew > 10) {
          status = 3;
        } else if (obj.new > 80 || percentNew > 5) {
          status = 2;
        } else {
          status = 1;
        }
          exampleArray[i].covidStatus = status;
      }
  }

}
var exampleArray = [
  {
      ascent: 1493,
      conditionStatus: "Minor Issues",
      county: "Cleburne",
      covidStatus: "",
      descent: -1485,
      difficulty: "blueBlack",
      id: 7002140,
      image: "https://cdn2.apstatic.com/photos/hike/7011377_medium_1554559259.jpg",
      latitude: 46.787,
      length: 5.3,
      location: "Eatonville, Washington",
      longitude: -121.735,
      name: "Skyline Trail",
      starVotes: 91,
      stars: 4.8,
      state: "Alabama",
      summary: "A popular and easily accessible route, skirting the slopes of Mount Rainier and Paradise Glacier.",
      userImg: "https://cdn2.apstatic.com/photos/hike/7011377_medium_1554559259.jpg"
  },
  {
      ascent: 1493,
      conditionStatus: "Minor Issues",
      county: "Washington",
      covidStatus: "",
      descent: -1485,
      difficulty: "blueBlack",
      id: 7002140,
      image: "https://cdn2.apstatic.com/photos/hike/7011377_medium_1554559259.jpg",
      latitude: 46.787,
      length: 5.3,
      location: "Eatonville, Washington",
      longitude: -121.735,
      name: "Skyline Trail",
      starVotes: 91,
      stars: 4.8,
      state: "Florida",
      summary: "A popular and easily accessible route, skirting the slopes of Mount Rainier and Paradise Glacier.",
      userImg: "https://cdn2.apstatic.com/photos/hike/7011377_medium_1554559259.jpg"
  },
  {
      ascent: 3281,
      conditionStatus: "All Clear",
      county: "San Francisco",
      covidStatus: "",
      descent: -3282,
      difficulty: "blueBlack",
      id: 7001016,
      image: "https://cdn2.apstatic.com/photos/hike/7004228_medium_1554244390.jpg",
      latitude: 47.4882,
      length: 6.6,
      location: "Tanner, Washington",
      longitude: -121.7233,
      name: "Mt. Si",
      starVotes: 110,
      stars: 4.4,
      state: "California",
      summary: "A steep, well-maintained trail takes you atop Mt. Si with outrageous views of Puget Sound.",
      userImg: "https://cdn2.apstatic.com/photos/hike/7004228_medium_1554244390.jpg"
  },
  {
      ascent: 370,
      conditionStatus: "All Clear",
      county: "King",
      covidStatus: "",
      descent: -370,
      difficulty: "blue",
      id: 7019080,
      image: "https://cdn2.apstatic.com/photos/hike/7032460_medium_1554933260.jpg",
      latitude: 47.4527,
      length: 2.3,
      location: "Riverbend, Washington",
      longitude: -121.7053,
      name: "Twin Falls",
      starVotes: 68,
      stars: 4.3,
      state: "Washington",
      summary: "A classic family-friendly route through old growth trees with a spectacular waterfall in the mix.",
      userImg: "https://cdn2.apstatic.com/photos/hike/7032460_medium_1554933260.jpg"
  },
  {
      ascent: 1619,
      conditionStatus: "All Clear",
      county: "King",
      covidStatus: "",
      descent: -1618,
      difficulty: "blueBlack",
      id: 7005406,
      image: "https://cdn2.apstatic.com/photos/hike/7004771_medium_1554310760.jpg",
      latitude: 47.4999,
      length: 3.9,
      location: "Issaquah, Washington",
      longitude: -122.0211,
      name: "Poo Poo Point via Chirico Trail",
      starVotes: 67,
      stars: 4.4,
      state: "Washington",
      summary: "A great place for a picnic and watching paragliders!",
      userImg: "https://cdn2.apstatic.com/photos/hike/7004771_medium_1554310760.jpg"
  },
  {
      ascent: 3739,
      conditionStatus: "Unknown",
      county: "Clallam",
      covidStatus: "",
      descent: -3748,
      difficulty: "black",
      id: 7002051,
      image: "https://cdn2.apstatic.com/photos/hike/7001107_medium_1554217677.jpg",
      latitude: 47.9551,
      length: 17.6,
      location: "Forks, Washington",
      longitude: -123.8357,
      name: "High Divide Loop",
      starVotes: 51,
      stars: 4.9,
      state: "Washington",
      summary: "This loop is a superlative experience that you'll be eager to repeat.",
      userImg: "https://cdn2.apstatic.com/photos/hike/7001107_medium_1554217677.jpg"
  },
  {
      ascent: 3848,
      conditionStatus: "All Clear",
      county: "King",
      covidStatus: "",
      descent: -3848,
      difficulty: "black",
      id: 7005408,
      image: "https://cdn2.apstatic.com/photos/hike/7005310_medium_1554311893.jpg",
      latitude: 47.4666,
      length: 9.7,
      location: "Riverbend, Washington",
      longitude: -121.6739,
      name: "Mailbox Peak Trail",
      starVotes: 51,
      stars: 4.5,
      state: "Washington",
      summary: "An infamous (easier) hike with a mailbox (maintained by volunteers) at the top!",
      userImg: "https://cdn2.apstatic.com/photos/hike/7005310_medium_1554311893.jpg"
  },
  {
      ascent: 3873,
      conditionStatus: "Minor Issues",
      county: "Skagit",
      covidStatus: "",
      descent: -3872,
      difficulty: "black",
      id: 7013011,
      image: "https://cdn2.apstatic.com/photos/hike/7023891_medium_1554845849.jpg",
      latitude: 48.4755,
      length: 11.5,
      location: "Stehekin, Washington",
      longitude: -121.075,
      name: "Cascade Pass to Sahale Arm",
      starVotes: 34,
      stars: 5,
      state: "Washington",
      summary: "Climb steadily through endless switchbacks to an awe-inspiring pass with impressive peaks & glaciers",
      userImg: "https://cdn2.apstatic.com/photos/hike/7023891_medium_1554845849.jpg"
  },
  {
      ascent: 2419,
      conditionStatus: "All Clear",
      county: "Snohomish",
      covidStatus: "",
      descent: -2419,
      difficulty: "blue",
      id: 7003986,
      image: "https://cdn2.apstatic.com/photos/hike/7007441_medium_1554322863.jpg",
      latitude: 47.8669,
      length: 11.1,
      location: "Gold Bar, Washington",
      longitude: -121.6779,
      name: "Wallace Falls and Lake",
      starVotes: 48,
      stars: 4.2,
      state: "Washington",
      summary: "A popular trail system with trail access to both Wallace Falls and Wallace Lake.",
      userImg: "https://cdn2.apstatic.com/photos/hike/7007441_medium_1554322863.jpg"
  },
  {
      ascent: 1295,
      conditionStatus: "Unknown",
      county: "Pierce",
      covidStatus: "",
      descent: -1295,
      difficulty: "blueBlack",
      id: 7002181,
      image: "https://cdn2.apstatic.com/photos/hike/7027431_medium_1554916207.jpg",
      latitude: 46.9336,
      length: 5.6,
      location: "Eatonville, Washington",
      longitude: -121.8647,
      name: "Tolmie Peak",
      starVotes: 37,
      stars: 4.7,
      state: "Washington",
      summary: "A manageable out-and-back showcasing multiple lakes and panoramic views from atop Tolmie Peak.",
      userImg: "https://cdn2.apstatic.com/photos/hike/7027431_medium_1554916207.jpg"
  }
];

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
  $(".trail-tile").on("click", function () {
    // Here we will need to populate the trail modal

    // activate modal
    $(".small.modal")
      .modal("setting", "transition", "vertical flip")
      .modal("toggle", "show-dimmer");
  });
});
