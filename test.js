

// var riskL1 = "<span class='fas fa-circle checked icon'></span><span class='fas fa-circle icon'></span><span class='fas fa-circle icon'></span>";
// var riskL2 = "<span class='fas fa-circle checked icon'></span><span class='fas fa-circle checked icon'></span><span class='fas fa-circle icon'></span>";
// var riskL3 = "<span class='fas fa-circle checked icon'></span><span class='fas fa-circle checked icon'></span><span class='fas fa-circle checked icon'></span>"

// var popL1 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span>"
// var popL2 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span>"
// var popL3 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking icon'></span><span class='fas fa-hiking icon'></span>"
// var popL4 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking icon'></span>"
// var popL5 = "<span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span><span class='fas fa-hiking checked icon'></span>"

    // function populateTiles() {
    
    //     for (var i = 0; i < trailArray.length; i++){

    //       var trailTile = $("<div class='trail-tile'>");
    //       var imgBox = $("<div class='img-box'>");
    //       var trailImg = $("<img class='trail-img'>");
    //       var trailName = $("<h4 class='trail-name'>");
    //       var county = trailArray[i].county;
    //       $(trailName).text(trailArray[i].name)
    //       var trailInfo = $("<div class='trail-info'>");
    //       var pStatus = $("<p>");
    //       var spanStatus = $("<span class='status'>");
    //       var riskRatingP = $("<p class='risk-rating'>").text("Covid-19 factor: ");
    //       var circleChecked = $("<span class='fas fa-circle checked icon'>");
    //       var circleBlanked = $("<span class='fas fa-circle icon'>");
    //       var popularityRating = $("<p class='popularity'>").text("Popularity: ");
    //       var hikingCheck = $("<span class='fas fa-hiking checked icon'>");
    //       var hikingBlanked = $("<span class='fas fa-hiking icon'>");
    //       var countyP = $("<p>");
    //       var countySpan = $("<span class='county'>");

    //       $("#two").append(trailTile);
    //       $(trailTile).append(imgBox);
    //       $(trailTile).attr("data-trailid", trailArray[i].id)
    //       $(imgBox).append(trailImg);
    //       $(trailImg).attr("src", trailArray[i].image)
    //       $(trailTile).append(trailName);
    //       $(trailTile).append(trailInfo);
    //       $(trailInfo).append(pStatus);
    //       $(pStatus).append(spanStatus);
    //       $(trailInfo).append(riskRatingP);
    //       if (trailArray[i].covidStatus === 3) {
    //         $(riskRatingP).append(riskL3)
    //       } else if (trailArray[i].covidStatus === 2) {
    //         $(riskRatingP).append(riskL2)
    //       } else {
    //         console.log(trailArray[i].covidStatus)
    //         $(riskRatingP).append(riskL1)
    //       }
          
    //       $(trailInfo).append(popularityRating);

    //       if(trailArray[i].popularity === 1) {
    //         $(popularityRating).append(popL1)
    //       } else if (trailArray[i].popularity === 2){
    //         $(popularityRating).append(popL2)
    //       } else if(trailArray[i].popularity === 3){
    //         $(popularityRating).append(popL3)
    //       } else if(trailArray[i].popularity === 4){
    //         $(popularityRating).append(popL4)
    //       } else {
    //         $(popularityRating).append(popL5)
    //       }

    //      $(trailInfo).append(countyP)
    //       $(countyP).text("County: ");
    //       $(countySpan).text(county);
    //       $(countyP).append(countySpan);
    //     }

    //   }

    $( document ).ready(function() {

      populateTiles();
      $(".trail-tile").on("click", function () {

        // $("#covid-rating").empty();
        // $("#pop-rating").empty();

       
        // var id = $(this).attr("data-trailid");
        // console.log(id)
        // var targetTrail = trailArray.find(item => item.id == id);
        // console.log(targetTrail) 
        // $("#modal-name").text(targetTrail.name);

        // $(".status").text(targetTrail.conditionStatus);

        // if (targetTrail.covidStatus === 3) {
        //   $("#covid-rating").append(riskL3)
        // } else if (targetTrail.covidStatus === 2) {
        //   $("#covid-rating").append(riskL2)
        // } else {
        //   $("#covid-rating").append(riskL1)
        // }

        // if (targetTrail.popularity === 1) {
        //   $("#pop-rating").append(popL1)
        // } else if (targetTrail.popularity === 2){
        //   $("#pop-rating").append(popL2)
        // } else if(targetTrail.popularity === 3){
        //   $("#pop-rating").append(popL3)
        // } else if(targetTrail.popularity === 4){
        //   $("#pop-rating").append(popL4)
        // } else {
        //   $("#pop-rating").append(popL5)
        // }
       
        // $("#difficulty").text(targetTrail.difficulty);
        // $("#location").text(targetTrail.county + " County, " + targetTrail.state);
        // $("#summary").text(targetTrail.summary);
        // $("#more-info").attr("href", targetTrail.url);
        // $("#modal-image").attr("src", targetTrail.image);
        // Here we will need to populate the trail modal
    
        // activate modal
        $(".small.modal")
          .modal("setting", "transition", "vertical flip")
          .modal("toggle", "show-dimmer");
      });

    });