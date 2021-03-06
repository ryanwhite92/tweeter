/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() {

  // Takes a tweet object and returns a tweet article element containing the
  // tweets entire HTML structure
  function createTweetElement(data) {
    const $tweet = $('<article>').addClass('tweet');
    const $header = $('<header>').addClass('header');
    const $content = $('<p>');
    const $footer = $('<footer>');
    const $footerRight = $('<div>').addClass('footer-right');
    const $likeSpan = $('<span>');
    const $likeClick = $('<a>').attr('href', '#').appendTo($likeSpan);
    const tweetAge = moment(data.created_at).fromNow();

    // Add data into header section of tweet
    $('<img>').attr('src', data.user.avatars.small).appendTo($header);
    $('<h2>').text(data.user.name).appendTo($header);
    $('<p>').text(data.user.handle).appendTo($header);

    // Add tweet text content
    $content.text(data.content.text);

    // Add data into footer section of tweet
    $('<small>').text(tweetAge).appendTo($footer);
    $('<i>').addClass('fas fa-flag').appendTo($footerRight);
    $('<i>').addClass('fas fa-retweet').appendTo($footerRight);
    $('<i>')
      .addClass('like fas fa-heart')
      .attr({'data-id': data._id, 'data-likes': data.likes})
      .appendTo($likeClick);
      $('<small>').text(data.likes).appendTo($likeSpan);

    return $tweet.append(
        $header,
        $content,
        $footer.append($footerRight.append($likeSpan))
      );
  }

  // Takes in an array of tweet objects and appends each one to the
  // tweets-container section
  function renderTweets(tweets) {
    const $tweetsContainer = $('#tweets-container');

    // Ensure tweets-container is empty before appending tweets
    $tweetsContainer.empty();

    // Order tweets in reverse chronological order
    tweets = tweets.sort(function(a, b) {
      return b.created_at - a.created_at;
    });

    tweets.forEach(function(tweet) {
      const $addTweet = createTweetElement(tweet);
      $addTweet.appendTo($tweetsContainer);
    });
  }

  // Fetches tweets from localhost:8080/tweets
  function loadTweets() {
    $.ajax({
      url: '/tweets',
      method: 'GET',
      success: function(tweets) {
        renderTweets(tweets);
      }
    });
  }

  // Check that tweet content is not empty and/or exceed 140 characters
  function validateTweet(tweetContent) {
    if (tweetContent === '' || tweetContent === null) {
      return 'Tweet content empty.';
    } else if (tweetContent.length > 140) {
      return 'Tweet exceeded character length.';
    }

    return true;
  }

  loadTweets();

  $('.new-tweet form').on('submit', function(event) {
    event.preventDefault();

    const $this = $(this);
    const $textarea = $this.children('textarea');
    const $inputValue = $textarea.val();
    const validateInput = validateTweet($inputValue);

    // Hide error message if it is shown, after change its text value
    $this.children('small').slideUp(function() {
      $this.children('small').text(validateInput);
    });

    // Slide error message down if validateInput is not true
    if (validateInput !== true) {
      $this.children('small').slideDown();
      return;
    }

    const $input = $this.serialize();

    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: $input,
      success: function(tweets, status) {
        loadTweets();
        $textarea.val('').trigger('input');
      }
    });

  });

  $('.nav-right a').on('click', function(event) {
    const $newTweet = $('.new-tweet');

    // Callback function focuses on textarea once slideToggle animation
    // has finished
    $newTweet.slideToggle(function() {
      $newTweet.find('textarea').focus();
    });
  });

  $('#tweets-container').on('click', function(event) {
    event.preventDefault();

    if (event.target.classList[0] === 'like') {
      const $target = $(event.target);
      const tweetId = $target.attr('data-id');
      let likes = $target.attr('data-likes');
      let adjustment;

      if (event.target.classList.contains('liked')) {
        likes--;
        $target.removeClass('liked');
        adjustment = -1;
      } else {
        likes++;
        $target.addClass('liked');
        adjustment = 1;
      }

      $target.attr('data-likes', likes);
      $target.closest('span').find('small').text(likes);

      $.ajax({
        url: '/tweets/' + tweetId,
        method: 'POST',
        data: {adjustment: adjustment},
        success: function(tweets, status) {
          console.log('updated likes.');
        }
      });
    }
  });

});