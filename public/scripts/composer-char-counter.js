// Make sure the DOM has loaded
$(document).ready(function() {

  $('section.new-tweet textarea').on('input', function() {
    const tweetText = $(this).val();
    const counter = $(this).siblings('.counter');
    const charCount = 140 - tweetText.length;

    if (charCount < 0) {
      counter.addClass('invalid');
    } else {
      counter.removeClass('invalid');
    }

    counter.html(charCount);
  });

});
