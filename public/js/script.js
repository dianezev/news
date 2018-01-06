/*
 * Developer: Diane Zevenbergen, dianezev@gmail.com
 * December 2017
 *
 * THIS IS A WORK IN PROGRESS. STILL TO BE DONE:
 * 0. Add wait symbol
 * 1. Revise for MVC Pattern
 * 2. Expand API calls to obtain stories and story links from multiple news sources (using newsapi.org)
 * 3. Put api keys in env for security
 * 4. Deploy
 *
 *
 * Request & render stories and story titles from news organizations.
 * Uses API from npr.org and newsapi.org
 *
 * To keep the API key private when requesting STORIES,
 * use node.js/Express to make a server-side request.
 * TBD: implement env?
 */

$(function(){
  'use strict';

  var HREF_NPR = 'http://api.npr.org/';
  var $news = $('#newsStories');

  // Bind click event to get NPR stories
  $('.newsSection').on('change', 'select', function(e) {
    getNPR_Stories(HREF_NPR);
    e.preventDefault();
  });

  // User clicks news title to open or close
  $('#newsStories').on('click', 'li .title', function() {
    toggleStory(this.parentElement.id);
  });

  // User clicks up arrow to close story
  $('#newsStories').on('click', '.endStory', function() {
    toggleStory($(this).attr("name"));
  });
  

      
  // API key is req'd to get NPR STORIES
  // Ask Michael about options for privacy - .env? app.js?
  function getNPR_Stories(href) {
    var id;
    var categ;
    var output;
    var myRoute;
    var reqObject;

    id = $('select[name=nprTopics]').val();
    categ=$('select[name=nprTopics] option:selected').text();
    output = 'JSON';
    myRoute = '?href=' + href + '&id=' + id + '&output=' + output;

    reqObject = {url: '/cors' + myRoute,
                method: 'POST',
                success: nodeNPR_Success
            };
    $.ajax(reqObject);
  }
      
  /*
   * This is AJAX success function - called by getNPR_Stories
   */
  function nodeNPR_Success (results) {
    var storyHTML;
    var re;
    
    // Remove any story listings
    $news.empty();
    
    var dataArray = results.list.story;
    
    storyHTML = getNPR_StoryHTML(dataArray);

    // Use regex to remove some extraneous stuff from html
    re = new RegExp('</ul></p><p>&nbsp;&nbsp;&nbsp;&nbsp;<ul></p><p>&nbsp;&nbsp;&nbsp;&nbsp;', 'g');
    storyHTML = storyHTML.replace(re, '');

    $news.append(storyHTML);
    
    // Make all links in stories open new tab
    $('#newsStories a').attr('target', '_blank');
    return;
  }
  
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

  
  // TBD: add wait symbol while stories retrieved
  
  // TBD improve animation 
  function toggleStory(id) {
    
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
});
  
  
  
