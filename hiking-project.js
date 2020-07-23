$(document).ready(function() {

    
    // Variables for our API call.  Lat, lon, distance will be determined by the end user but are hard-coded for now
    var preHikingQueryURL = "https://www.hikingproject.com/data/get-trails?lat="
    var lat = 47.6062
    var lon = -122.3321
    var distance = 100
    var hikingAPIkey = "200842322-939f54646af26cdd74e5614a1181a8da"
    var hikingQueryURL = preHikingQueryURL + lat + "&lon=" + lon + "&maxDistance=" + distance + "&key=" + hikingAPIkey

    // Make variables that we will use to store trail data global
    var result = ""
    var resultStr = ""
    var trailArray = ""
    var trailName = ""
    var trailSummary = ""
    var trailDifficulty = ""
    var trailVotes = ""
    var trailImg = ""
    var trailLength = ""
    var trailAscent = ""
    var trailDescent = ""
    var trailLon = ""
    var trailLat = ""

    function getTrailData(){


    // API Call to Hiking Project

    $.ajax({
        url: hikingQueryURL,
        method: "GET"
      }).then(function(response){

        result = response.trails
        trailArray= []


        for (var i = 0; i < result.length; i++) {
        // If a trail is closed, we don't push it to our trail array
            if (result[i].conditionStatus.includes("Closed")) {
                // We won't actually do anything with the variable "x", it's just a placeholder
                var x = 1
        // If open we push to the trail array
            } else {
                trailArray.push(result[i])
            }
            
        }
        
        // Set our newly created Trail array to local storage, this is the only way I've found for us to reference the array globally

 
        localStorage.setItem("trailArray", JSON.stringify(trailArray))


      })

      // Parse our new local storage item so that it can be referenced

      trailArray = JSON.parse(localStorage.getItem("trailArray"));

      
      
      console.log(trailArray[1].name)


    }

    // Run our function

    getTrailData()

    console.log(trailArray[2].name)

    // When we are done using the data from our trailArray, it would be best if we deleted that item from localStorage, but definitely not sooner or 
    //else it won't work
    localStorage.removeItem("trailArray")
    
})