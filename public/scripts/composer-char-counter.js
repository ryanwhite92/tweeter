// Make sure the DOM has loaded
$(document).ready(function() {

  $('section.new-tweet textarea').on('input', function() {
    var tweetText = $(this).val();
    var counter = $(this).siblings('.counter');
    var charCount = 140 - tweetText.length;

    if (charCount < 0) {
      counter.addClass('invalid');
    } else {
      counter.removeClass('invalid');
    }

    counter.text(charCount);
  });

});
