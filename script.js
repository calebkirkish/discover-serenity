
   // Variables for our API call.  Lat, lon, distance will be determined by the end user but are hard-coded for now
    var preHikingQueryURL = "https://www.hikingproject.com/data/get-trails?lat="
    var lat = 47.6062
    var lon = -122.3321
    var distance = 100
    var maxResults = 10
    var hikingAPIkey = "200842322-939f54646af26cdd74e5614a1181a8da"
    var hikingQueryURL = preHikingQueryURL + lat + "&lon=" + lon + "&maxDistance=" + distance + "&maxResults=" + maxResults + "&key=" + hikingAPIkey
    var gKey = "AIzaSyDQOySmk8taGDt9pVaSXmNHpO0jjMnQkJ8"

    // Make variables that we will use to store trail data global
    var trailArray = []
    var result = "";
    

    // Trail Class used for creating object 
    class Trail {
        constructor(id, name, summary, difficulty, stars, starVotes, location, image, trailLength, ascent, descent, longitude, latitude, conditionStatus) {
            this.id = id;
            this.name = name;
            this.summary = summary;
            this.difficulty = difficulty
            this.stars = stars
            this.starVotes = starVotes
            this.location = location
            this.image = image
            this.length = trailLength
            this.ascent = ascent
            this.descent = descent
            this.longitude = longitude
            this.latitude = latitude
            this.conditionStatus = conditionStatus
            this.userImg = image;
            this.covidStatus = "";
            this.county = "";
            this.state = "";
            this.popularity = "";
        }
    }
    //document ready
    $(document).ready(function() {

    // 
    
    function getCounty(lat, lon, trail) {
        var queryLocation = lat + ", " + lon;
        var url =
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          queryLocation +
          "&sensor=false&key=" +
          gKey;
          
        // console.log(url);
        $.ajax({
          method: "GET",
          url: url,
        }).then(function (response) {
          // console.log(response);
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
              // console.log(itemCounty);
            }
            
        })
      
          trail.county = itemCounty;
          trail.state = itemState;
        // console.log(result)
        });   
     
    }
            



    function getTrailData(){

     


    // API Call to Hiking Project

    $.ajax({
        url: hikingQueryURL,
        method: "GET"
      }).then(function(response){

        result = response.trails



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
                var difficulty = result[i].difficulty
                var stars = result[i].stars
                var starVotes = result[i].starVotes
                var location = result[i].location
                var image = result[i].imgMedium
                var trailLength = result[i].length
                var ascent = result[i].ascent
                var descent = result[i].descent
                var longitude = result[i].longitude
                var latitude = result[i].latitude
                var conditionStatus = result[i].conditionStatus
                // this puts the image URL in a format that we can use
                image.replace(/\//g, '/');

                // push the result from the JSON object into the Trail object(class), then push that object into the trail Array
                Trail.trailID = result[i].trailID
                
                currentTrail = new Trail(id, name, summary, difficulty, stars, starVotes, location, image, trailLength, ascent, descent, longitude, latitude, conditionStatus);
                trailArray.push(currentTrail)

                // var county = getCounty(lat, lon);
                }
            
            }
        
        // Set our newly created Trail array to local storage, this is the only way I've found for us to reference the array globally

        
// take the latitude and longitude from the hiking project API call and plug them into the getCounty() function
      }).then(function(){

        trailArray.forEach(trail => {
          var lat = trail.latitude;
          var lon = trail.longitude;
          getCounty(lat, lon, trail);
          // console.log(result);
          // trail.county = result.currentCounty;
          // trail.state = result.currentState;

        });

        // Here we need another .then for covid data function that passes in the trailArray. Within the covid function it will make one API call for the state (if there are multiple states it will need to handle that with another call)
        // foreach trail it will look at the trail.county and then search the stateData array for that county and add the applicable covid risk to that trail. Will need to write an error that will display unknown if the code 

        // this will be followed by a .done function that creates tiles for the trail data

        console.log(trailArray)

      
          
        // all code can go here after AJAX calls

      var trail = trailArray[0];
      
      
      
      
      


      })

      // Parse our new local storage item so that it can be referenced

      


    }

    // Run our function

    getTrailData();

    
    
    });