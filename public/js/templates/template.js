//LEFT OFF HERE - adapt template stuff from math facts for news app

NEWS = window.NEWS || {};

NEWS.template = (function() {
    'use strict';   
    
    // Used to update numeric buttons
    var _tplButton = _.template('<div class="btn-group" role="group">' +
                                    '<button type="button" class="btn btn-default" ' +
                                            'value=<%= propVal %>><%= buttonVal %>' +
                                    '</button>' +
                                '</div>');
    
    // Used to set the header for a timed test
    var _tplTimerStart = _.template('<p>' +
                                        '<%= msg %>' +
                                  '</p>' +
                                  '<p>' +
                                        '<%= oper %>: <%= label %>' +
                                  '</p>');
    
    // Used to set HTML for the problem set (not including values or answer region)
    var _tplProblems = _.template('<div class="problem cf">' +
                                    '<div class="top_el">' +
                                        '<p id="topVal<%= probNum %>"></p>' +
                                    '</div>' +
                                    '<div class="operator">' +
                                        '<p class="valop"></p>' +
                                    '</div>' +
                                    '<div class="bottom_el">' +
                                        '<p id="bottomVal<%= probNum %>"></p>' +
                                    '</div>' +
                                 '</div>');
    
    
    var _tplNewsStory = _.template('<div class="newsDiv col-12 col-md-6 col-xl-4">' +
                                      '<div class="gridBox">' +
                                        '<div class="news alignTop">' +
                                          '<h6><img src="images/npr-home.png" alt="NPR" /></h6>' +
                                          '<%= someVar %>' +
                                        '</div>' +
                                      '</div>' +
                                    '</div>');
  
  
    var publicAPI = {
        fillNPR_Stories: function(storyObj) {
          
// LEFT OFF HERE - incorporating something along these lines:          
//              var story;
//              var paraArray;
//              var title;
//              var link;
//              var storyDate;

          
      //        paraArray = dataArray[i].textWithHtml.paragraph;
      //        storyDate = new Date(dataArray[i].storyDate.$text);
      //        title = dataArray[i].title.$text;
      //        link = dataArray[i].link[0].$text;
      //        story += '<li><p class="title">'
      //                    + '<a href="' + link + '" target="_blank">'
      //                        + title
      //                    + '</a></p>'
      //                    + '<small>' + storyDate + '</small><br>';
      //        for (var j = 0, m = paraArray.length; j < m; j++) { 
      //            if (typeof paraArray[j].$text !== 'undefined') {
      //                story += '&nbsp;&nbsp;&nbsp;&nbsp;' 
      //                        + paraArray[j].$text
      //                        + '<br>';
      //            }
      //        }
      //        story += '</li><br>';
          // return some html
          
        },
        getButtonsHTML: function(start, rows, buttonsPerRow) {
            var numbersHTML = '';
            var buttonVal;
            var propVal;

            for (var i = 0; i < rows; i++) {
                numbersHTML += 
                        '<div class="numberButtons btn-group ' +
                                'btn-group-justified" role="group">';

                for (var j = 0; j < buttonsPerRow; j++) {
                    buttonVal = (i * buttonsPerRow) + (start + j);
                    propVal = (i * buttonsPerRow) + (j + 1);
                    numbersHTML += _tplButton({propVal: propVal, 
                                        buttonVal: buttonVal});
                }
                numbersHTML += '</div>';
            }
            return numbersHTML;            
        },
        getBubbleHTML: function () {
            return '<div class="blob"></div>';
        },
        getAnswersHTML: function (perPage, useInputTags) {
            var answersHTML = '';            

            if (useInputTags) {

                // This loop builds html for problem answers using <input> tags
                for (var i = 1; i <= perPage; i++ ) {
                    answersHTML += _tplAnswersWithInputTags({probNum: i});
                }
            
            } else {

                // This loop builds html for problem answers using <p> tags
                for (var i = 1; i <= perPage; i++ ) {
                    answersHTML += _tplAnswersWithPTags({probNum: i});
                }
            
            }
            
            return answersHTML;
        },
        getProblemsHTML: function (perPage) {
            var problemsHTML = '';
            var i;

            // This loop builds html for problem values
            for (i = 1; i <= perPage; i++ ) {
                problemsHTML += _tplProblems({probNum: i});
            }

            return problemsHTML;
        },
        getTimerStartHTML: function (data) {
            return _tplTimerStart(data);
        },
        getTimerScoreHTML: function (correct, attempted, percent) {
            return _tplTimerScore({correct: correct, attempted: attempted, percent: percent});
        },
        getTimerDataHTML: function (errorArray, operator) {
            var timerDataHTML = '';
            
            $.each(errorArray, function(j, error) {
                timerDataHTML += '<tr>' + _tplListError({val1: error[0], val2: error[1], incorrect: error[2], correct: error[3], operator: operator});
            });
            
            return timerDataHTML;
        },
        getOverallScoresHTML: function (title, id, operator, all, results) {

            /*
             * Loops through practice & timed results for all levels
             * for a given operator 'oper'
             * and appends the results to the 'id' selector
             */
                var correct = 0;
                var attempted = 0;
                var percent = 0;
                var htmlLevel = '';
                var htmlPractice = '';
                var htmlTimed = '';
                var htmlErrors = '';
                var htmlOverall = '';
                var type = '';

                // Loop through all levels & display results for each
                $.each(results.level, function(i,level) {
                    htmlLevel = _tplScoresLevel({title: title, level: level.label});
                    htmlTimed = '';

                    if (level.practice[1] !== 0) {
                        correct = level.practice[0];
                        attempted = level.practice[1];
                        all[0] += correct;
                        all[1] += attempted;
                        percent = Math.round((correct/attempted)*100);
                        htmlPractice = htmlLevel +
                                        _tplScoresLine1({type: 'Practice',
                                                           correct: correct,
                                                           attempted: attempted,
                                                           percent: percent});
                        htmlOverall += htmlPractice;
                    }

                    // Get results for each timed test within level
                    $.each(level.timed, function(j, test) {
                        correct = test[0];
                        attempted = test[1];
                        all[0] += correct;
                        all[1] += attempted;

                        // Don't show results if 0 problems attempted
                        if (attempted > 0) {
                            percent = Math.round((correct/attempted)*100);

                            type = 'Timed test ' + (j+1);

                            /*
                             * If there are no practice results, begin Test
                             * section with level info (i.e. 'Add +1...12')
                             */
                            if ((level.practice[1] === 0)&&(j===0)) {
                                htmlTimed = htmlTimed + htmlLevel +
                                            _tplScoresLine1({type: type,
                                                               correct: correct,
                                                               attempted: attempted,
                                                               percent: percent});
                            } else {
                                htmlTimed = htmlTimed +
                                            _tplScoresAddl({type: type,
                                                               correct: correct,
                                                               attempted: attempted,
                                                               percent: percent});
                            }
                        }
                    });

                    htmlOverall += htmlTimed;

                    if (level.errors.length > 0) {
                        
                        // This begins FIRST error row
                        htmlErrors = '<tr><td></td><td>Errors: </td>';
                        
                        $.each(level.errors, function(j,error) {
                            
                            // This begins any ADDITIONAL error rows (after first)
                            if (j > 0) {
                                htmlErrors = htmlErrors + '<tr><td></td><td></td>';
                            }

                            // Get error & correct answer info                             
                            htmlErrors = htmlErrors +
                                        _tplListError({val1: error[0],
                                                       val2: error[1],
                                                       incorrect: error[2],
                                                       correct: error[3],
                                                       operator: operator});
                        });

                        htmlOverall += htmlErrors;
                    }
                });
            
                return htmlOverall;
        },
        getTopics: function (labelRange, operator) {
            var subMenuHTML = '';
            
            // Create html string used to generate submenu
            for (var i = 0, l = labelRange.length; i < l ; i +=1) {
                subMenuHTML += _tplSubMenu({operator: operator, label: labelRange[i]});
            }            
            
            return subMenuHTML;
        },
    };

    return publicAPI;
})();
