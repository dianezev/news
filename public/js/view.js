NEWS = window.NEWS || {};

NEWS.view = (function() {
  'use strict';
  
  /**************************
   * Private vars here
   *************************/
  var $news = $('#newsStories');

  
  /**************************
   * Private functions here
   *************************/
  
  // TBD: for now default with startDate = today & endDate 60 days back
  // then make dynamic later
  // When no stories, add message 'no stories for ... between a & b"
    
  // This function puts stories into div with collapsible list items
  function getNPR_StoryHTML(stories) {
    var storyHTML = '<ul>';    
    var paraArray;
    var title;
    var link;
    var storyDate;
    
    var endDate = new Date();
    var startDate = new Date(endDate - (1000*3600*24*60));

    for (var i = 0, n = stories.length; i < n; i++) { 
    
      storyDate = new Date(stories[i].storyDate.$text);
      
      if ((storyDate <= endDate) && (storyDate >= startDate)) {

        paraArray = stories[i].textWithHtml.paragraph;      
        title = stories[i].title.$text;
        link = stories[i].link[0].$text;
        storyHTML += '<li id="story_' + i + '">'
                      + '<h5 class="title">'
                          + '<div class="storyTitle">'
                            + '<span class= "pointRight"><i class="fa fa-chevron-right"></i></span>'
                            + '<span class= "pointDown hide"><i class="fa fa-chevron-down"></i></span>'
                            + '<p>' + title + '</p>'
                          + '</div>'
                      + '</h5>'
                      + '<p class="hide storyDate"><a href="' + link + '"><small>' + storyDate + '</small></a></p>'
                      + '<div class="hide detail">';

        for (var j = 0, m = paraArray.length; j < m; j++) { 
            if (typeof paraArray[j].$text !== 'undefined') {
                storyHTML += '<p>&nbsp;&nbsp;&nbsp;&nbsp;' 
                        + paraArray[j].$text
                        + '</p>';
            }
        }
        storyHTML += '<div class="endStory" name="story_' + i + '">'
                        + '<span class= "pointUp"><i class="fa fa-chevron-up fa-2x"></i></span>'
                    + '</div>'
                  + '</div></li>';
      }
    }
    storyHTML += '</ul>';
    
    if (storyHTML === '<ul></ul>') {
        storyHTML = '<p>There are no stories for the selected topic between ' + startDate + ' & ' + endDate + '.</p>';
    }
    return storyHTML;
  }
  
  
  /******************************
   * Public vars & functions here
   *****************************/
  var publicAPI = {
    
    /******** Public vars here ********/
    
    

    /******** Public functions here ********/
    
    // Callback function when user selects a topic from NPR dropdown
    nodeNPR_Success: function (results) {
      var storyHTML;
      var re;
      var dataArray = [];

      // Remove any story listings
      $news.empty();

      dataArray = results.list.story;

      storyHTML = getNPR_StoryHTML(dataArray);

      // Use regex to remove some extraneous stuff from html
      re = new RegExp('</ul></p><p>&nbsp;&nbsp;&nbsp;&nbsp;<ul></p><p>&nbsp;&nbsp;&nbsp;&nbsp;', 'g');
      storyHTML = storyHTML.replace(re, '');

      $news.append(storyHTML);

      // Make all links in stories open new tab
      $('#newsStories a').attr('target', '_blank');
      return;
    },

    // Called when user hides/shows NPR story in listing
    toggleStory: function (id) {

      // Toggle between displaying/hiding story in ul
      if ($('#' + id + ' p').hasClass('hide')) {

          // First hide <p> for all <li> & set pointer to RIGHT
          $('.news p').addClass('hide');
          $('.news .detail').addClass('hide');
          $('.news span.pointDown').addClass('hide');
          $('.news span.pointRight').removeClass('hide');

          // Next display <p> for selected <li> and set pointer to DOWN
          $('#' + id + ' p').removeClass('hide'); 
          $('#' + id + ' .detail').removeClass('hide'); 
          $('#' + id + ' span.pointRight').addClass('hide');
          $('#' + id + ' span.pointDown').removeClass('hide');

          // Scroll story to top of browser
          var topLoc = $('#' + id).offset().top - $('nav').outerHeight(true);
          $('html,body').animate({
              scrollTop: topLoc},
              500);

      // Otherwise collapse the <p> element & reset pointer to RIGHT
      } else {
          $('#' + id + ' p').addClass('hide');
          $('#' + id + ' .detail').addClass('hide'); 
          $('span.pointDown').addClass('hide');
          $('#' + id + ' span.pointRight').removeClass('hide');
      }
    }
  };
  return publicAPI;
})();