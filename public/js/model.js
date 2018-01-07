NEWS = window.NEWS || {};

NEWS.model = (function() {
  'use strict';
  
  /******************************
   * Private vars here
   *****************************/
  var HREF_NPR = 'http://api.npr.org/';

  
  /******************************
   * Private functions here
   *****************************/
  
  
  
  /******************************
   * Public vars & functions here
   *****************************/
  var publicAPI = {
    
    /******** Public vars here ********/

    
    /******** Public functions here ********/
    
    // API key is req'd to get NPR STORIES
    // Ask Michael about options for privacy - .env? app.js?
    getNPR_Stories: function (id, cb) {
      var href = HREF_NPR;
      var output;
      var myRoute;
      var reqObject;

      output = 'JSON';
      myRoute = '?href=' + href + '&id=' + id + '&output=' + output;

      reqObject = {url: '/cors' + myRoute,
                  method: 'POST',
                  success: function(results) {
                    cb(results);
                  }
              };
      $.ajax(reqObject);
    }
  };
  return publicAPI;
})();