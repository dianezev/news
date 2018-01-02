/*
 * Developer: Diane Zevenbergen, dianezev@gmail.com
 * December 2017
 *
 * THIS IS A WORK IN PROGRESS. STILL TO BE DONE:
 * 1. Revise for MVC Pattern
 * 2. Expand API calls to obtain stories and story links from multiple news sources (using newsapi.org)
 * 3. Put api keys in env for security
 * 4. Deploy
 *
 *
 * Request & render NPR data.
 *
 * Note LISTING OF TOPICS from NPR does not require an API Key
 * but STORIES do require a key.
 *
 * To keep the API key private when requesting STORIES,
 * use node.js/Express to make a server-side request.
 * TBD: implement env?
 * (TBD: verify that it won't show up in url, github, etc.)
 *
 * For LISTING OF TOPICS (which do not require API key), make request
 * from client.
 *
 */
$(window).on("load", function() {
//'use strict';
//
//$(function(){
    var ID = 3002;
    var HREF = 'http://api.npr.org/';

    var $goQuery = $('[id^=goQuery]');
    var $topicList = $('#nprTopics');
    var $resultDesc = $('h1.describe');
    var $news = $('#newsStories');
//    var $error = $('#result p.error');
//    var categ;
  
    // Drop this since it is a legacy system & it brings in some topics that are out of date
    //getNPR_Topics(ID, HREF);
  
    // Experimental: API call to newsapi.org - to get listing of sources that provide headlines to newsapi.org
    // getNewsAPI_Sources();
  
  
  
    // Initially hide details
    $('[id$=Options]').hide();
    $resultDesc.hide();
    
    // Bind click event to get NPR stories
    // 'About' information details
    $('.newsSection').on('change', 'select', function(e) {
      getNPR_Stories(HREF);
      e.preventDefault();
    });

  
    // User clicks title to open or close
    $('#newsStories').on('click', 'li .title', function() {
      console.log('clicked togg');
      toggleStory(this.parentElement.id);
    });

    // TBD could make title click use this as well and drop above event
    // User clicks up arrow to close story
    $('#newsStories').on('click', '.endStory', function() {
      toggleStory($(this).attr("name"));
    });
  
    // Hide/show options based on user selection
    $('[id^=tog]').click(function() {
        var idToShow = this.nextElementSibling.id;

        $('[id$=Options]').hide();
        $('#' + idToShow).show();
        clearResults();
    });

  
  // TBD: streamline ajax calls to one function & add vars as needed
  // Function makes AJAX call to newsapi.org get list of sources that provide top stories
  function getNewsAPI_Sources() {
    var method;
    
    // keep apikey private...
    //var url = 'https://newsapi.org/v2/sources?language=en&apiKey=API_KEY_GOES_HERE';
    var reqObject;

    method = 'GET';

    reqObject = {
        url: url,
        dataType: 'JSON',
        method: method,
        success: function (data, state, res) {
//          showResults(data, res, listFromJSON);
        },
        error: function (data, state) {
            showError(state);
        }            
    };

    $.ajax(reqObject);
  }


  
  // Function makes AJAX call to get all topics available from NPR
  function getNPR_Topics(id, href) {
    var output;
    var method;
    var url;
    var reqObject;

//    $('body').addClass('wait');
//
//    $resultDesc.text('Please wait...');
//    $resultDesc.show();

    id = ID;
    output = 'JSON';
    method = 'GET';            
    url = href + 'list?' +
            'id=' + id +
            '&output=' + output;
console.log(url);
    reqObject = {
        url: url,
        dataType: output,
        method: method,
        success: function (data, state, res) {
          showResults(data, res, listFromJSON);
        },
        error: function (data, state) {
            showError(state);
        }            
    };

    $.ajax(reqObject);
  }

      
  // Note that although AJAX call can retrieve NPR TOPICS 
  // on the client side without an API key,
  // an API key is req'd to get STORIES
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
                success: nodeNPR_Success_ver2
            };
    $.ajax(reqObject);
  }
      
      
      
  // Clear results area whenever user selects different option
  function clearResults() {
      $result.text('');
      $error.text('');
      $resultDesc.hide();
  }

  /*
   * This is called by the success functions in AJAX calls from CLIENT.
   */
  function showResults (data, res, parser) {
      var results = '';

      if (data) {
          results = parser(data);
          $topicList.empty().html(results);
      } else {
        //tbd add error info
//            $result.text('STATUS CODE: ' + res.status);
      }
      $('body').removeClass('wait');
  }    
    
  function showError (state) {
      $resultDesc.text('Error occurred...');
      $result.addClass('error');
      $error.text(state);
      $('body').removeClass('wait');
  }


  /*
   * Called by fcn showResults
   * Parses JSON data returned from AJAX call from CLIENT
   * Based on NPR API format information for JSON formatted listings
   */
  function listFromJSON(data) {
      var dataArray = data.item;
      var listing = '<option value="" disabled selected>Select a topic</option>';

      for (var i = 0, l = dataArray.length; i < l; i++){
          listing += '<option value=' + dataArray[i].id + '>' + dataArray[i].title.$text + '</option>';
//            listing += '<li value=' + dataArray[i].id + '>' + dataArray[i].title.$text + '</li>';
      }
      return listing;
  }

  /*
   * (version 2 - puts stories into collapsible div)
   * This is called by the success functions that
   * handle AJAX calls from SERVER using node.js.
   */
  function nodeNPR_Success_ver2 (results) {
    console.log('in nodeSuccess and results are:');
    console.log(results);
    var storyHTML;
    var re;
    
    // Remove any story listings
    $news.empty();
    
    var dataArray = results.list.story;
    
    storyHTML = getNPR_StoryHTML_ver2(dataArray);

    //console.log(storyHTML);
      
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
    
  // This function puts stories into one collapsible div
  function getNPR_StoryHTML_ver2(stories) {
    console.log(stories);
    var storyHTML = '';    
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
        console.log('i is ' + i + ' and title is ' + title + ' and link is ' + link);
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
    if (storyHTML === '') {
        storyHTML = '<p>There are no stories for the selected topic between ' + startDate + ' & ' + endDate + '.</p>';
    }
    return storyHTML;
  }

  
  // LEFT OFF HERE: need to add date filter to just get more recent stories
  // add wait symbol while stories retrieved
  // fix pointer on up caret
  
  // TBD revise to use slideDown and slideUp, keeping the scroll animation
  function toggleStory(id) {
    // TBD switch to var
    
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
  
  
  
  /*
   * (version 1 - puts stories into separate divs)
   * This is called by the success functions that
   * handle AJAX calls from SERVER using node.js.
   */
  function nodeNPR_Success (results) {
    console.log('in nodeSuccess and results are:');
    console.log(results);
    
    // Remove any story listings
    $news.empty();
    
    var dataArray = results.list.story;
    var storyHTML;
    
    for (var i = 0, l = dataArray.length; i < l; i++) {
      
      storyHTML = getNPR_StoryHTML(dataArray[i]);
      
      $news.append(storyHTML);
    }
    console.log(storyHTML);
//    return storyHTML;
    return;
  }
  
  // Called by nodeNPR_Success & puts stories into separate divs
  function getNPR_StoryHTML(story) {
// TBD maybe use underscore template instead...
//    var _tplNewsStory = _.template('<div class="newsDiv col-12 col-md-6 col-xl-4">' +
//                                      '<div class="gridBox">' +
//                                        '<div class="news alignTop">' +
//                                          '<h6><img src="images/npr-home.png" alt="NPR" /></h6>' +
//                                          '<%= someVar %>' +
//                                        '</div>' +
//                                      '</div>' +
//                                    '</div>');
// use '_' var something like this:
//                    for (var j = 0; j < buttonsPerRow; j++) {
//                    buttonVal = (i * buttonsPerRow) + (start + j);
//                    propVal = (i * buttonsPerRow) + (j + 1);
//                    numbersHTML += _tplButton({propVal: propVal, 
//                                        buttonVal: buttonVal});
//                }

    var storyHTML = '<div class="newsDiv col-12 col-md-6 col-xl-4">' +
                            '<div class="gridBox">' +
                              '<div class="news alignTop">' +
                                '<h6><img src="images/npr-home.png" alt="NPR" /></h6>';
    var paraArray;
    var title;
    var link;
    var storyDate;

    paraArray = story.textWithHtml.paragraph;
    storyDate = new Date(story.storyDate.$text);
    title = story.title.$text;
    link = story.link[0].$text;
    storyHTML += '<h5 class="title">'
                + '<a href="' + link + '" target="_blank">'
                    + title
                + '</a></h5>'
                + '<p><small>' + storyDate + '</small></p>';
    for (var j = 0, m = paraArray.length; j < m; j++) { 
        if (typeof paraArray[j].$text !== 'undefined') {
            storyHTML += '<p>&nbsp;&nbsp;&nbsp;&nbsp;' 
                    + paraArray[j].$text
                    + '</p>';
        }
    }
    storyHTML += '</div>' +
                '</div>' +
              '</div>';

    return storyHTML;
  }

  
  
//  function formatStories(data) {
//    var dataArray = data.list.story;
//    var story = '';
//    var paraArray;
//    var title;
//    var link;
//    var storyDate;
//
//    for (var i = 0, l = dataArray.length; i < l; i++) {
//        paraArray = dataArray[i].textWithHtml.paragraph;
//        storyDate = new Date(dataArray[i].storyDate.$text);
//        title = dataArray[i].title.$text;
//        link = dataArray[i].link[0].$text;
//        story += '<li><h6 class="title">'
//                    + '<a href="' + link + '" target="_blank">'
//                        + title
//                    + '</a></h6>'
//                    + '<small>' + storyDate + '</small><br>';
//        for (var j = 0, m = paraArray.length; j < m; j++) { 
//            if (typeof paraArray[j].$text !== 'undefined') {
//                story += '&nbsp;&nbsp;&nbsp;&nbsp;' 
//                        + paraArray[j].$text
//                        + '<br>';
//            }
//        }
//        story += '</li><br>';
//    }
//    console.log(story);
//    return story;
//  }
});
