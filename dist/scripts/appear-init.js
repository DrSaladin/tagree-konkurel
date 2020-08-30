(function () {
  'use strict';

    //appear

    var  appearItem = $('.js-appear');
    if (appearItem.length) {
      appearItem.appear({force_process: true});
  
      appearItem.on('appear', function () {
        var thisItem = $(this);
        window.requestAnimationFrame(function() {
          thisItem.addClass('on-appear');
        });
      });

      window.scrollBy(0,1);
      window.scrollBy(0,-1);
    }

    var counter =  $('.js-counter');
    if (counter.length) {
      counter.appear({force_process: true});
      counter.on('appear', function () {
        $(this).countid({
          format: function( number ){
            var string = number.toFixed(0);
            string = string.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
            return string;
          }
        });
      });

      var aboutUsFactsWrapper = $('#js-aboutFactsWrapper');
      if (aboutUsFactsWrapper.length) {
        var aboutCounter =  aboutUsFactsWrapper.find('.js-counter');
        var lastCounter = $(aboutCounter[aboutCounter.length-1]);
        aboutUsFactsWrapper.on('scroll', function() {
          $.each(aboutCounter, function (i) {
            if ($(this).is(':appeared')) $.force_appear($(this));
            if (lastCounter.is(':appeared')) {
              aboutUsFactsWrapper.off();
            }
          });
        });
      }
    }

})();