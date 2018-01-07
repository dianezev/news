

// Bind click event to get NPR stories
$('.newsSection').on('change', 'select', function(e) {
  var id = $('select[name=nprTopics]').val();
  
  NEWS.controller.getNPR_Listing(id);
  e.preventDefault();
});

// User clicks news title to open or close
$('#newsStories').on('click', 'li .title', function() {
  NEWS.view.toggleStory(this.parentElement.id);
});

// User clicks up arrow to close story
$('#newsStories').on('click', '.endStory', function() {
  NEWS.view.toggleStory($(this).attr("name"));
});



