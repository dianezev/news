NEWS = window.NEWS || {};

NEWS.controller = (function() {
  'use strict';
  
  /******************************
   * Private vars here
   *****************************/
  var model = NEWS.model;
  var view = NEWS.view;

  

  
  /******************************
   * Private functions here
   *****************************/
  
  
  
  /******************************
   * Public vars & functions here
   *****************************/
  var publicAPI = {
    
    /******** Public vars here ********/

    
    /******** Public functions here ********/
    // TBD: Called when user clicks home page logo
    
    
    // TBD: Called when user clicks 'NPR'
    goNPR: function() {
  
    },
    
    // TBD: Called when user clicks any of the newsapi links (all but NPR)
    goOtherNews: function() {
  
    },
    
    // TBD: Called when user clicks 'About'
    goAbout: function() {
  
    },
    
    // TBD: Called when user selects a topic from NPR dropdown
    getNPR_Listing: function(id) {
      model.getNPR_Stories(id, function (results) {
        view.nodeNPR_Success(results);
      });
    },
    
    // TBD: Called when user clicks on a NPR story title (to open or close)
    toggleNPR_Story: function() {
  
    },
    
    // TBD: Called when user clicks bottom of NPR story to close it
    closeNPR_Story: function() {
  
    }
  };
  return publicAPI;
})();