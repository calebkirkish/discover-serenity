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
    var trailArray = []
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


        for (var i = 0; i < result.length; i++) {
        // If a trail is closed, we don't push it to our trail array
            if (result[i].conditionStatus.includes("Closed")) {
                console.log("closed")
        // If open we push to the trail array
            } else {
                trailArray.push(result[i])
            }
            
        }
        
        // If we reference a value within the trail array, we can find that value just fine

        console.log(trailArray[0])

        

      })

      


      
// This is where I run into issues.  We need to be able to store this array globally so that it can be referenced
// throughout our code, but it doesn't work
      
        console.log(trailArray[0])
      
      
     
    

    }

    getTrailData()

    

    



})