// Appending images for slideShow
$('.page-container').addClass('slideShowContainer');

$('.slideShowContainer').append(
  "<ul class='slideShow'>" 
  + "<li><img class='wallpaper' src='img/AnnettePH.jpg' alt='Annette Lake'/></li>" 
  + "<li><img class='wallpaper' src='img/kevin-wolf-unsplash.jpg'/></li>" 
  + "<li><img class='wallpaper' src='img/mick-haupt-unsplash.jpg'/></li>" 
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
    // Run timer and fade in / fade out
    slides.eq(slideCount).fadeIn(1000).delay(2000).fadeOut(1000, function() {
      slideCount < totalSlides - 1 ? slideCount ++ : slideCount = 0;
      slideShow();
    });
  }
});