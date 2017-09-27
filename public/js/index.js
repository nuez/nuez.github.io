/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

      $('.menu-trigger').click(function(){
          $('body').toggleClass('menu-open');
      })

    });

}(jQuery));