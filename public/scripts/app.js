/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() {

  // Return time since tweet was created as days, hours, minutes, or seconds
  function timeSince(created) {
    const seconds = Math.floor((Date.now() - created) / 1000);
    let time = Math.floor(seconds / (60 * 60 * 24));

    if (time > 1) {
      return time + ' days ago';
    }

    time = Math.floor(seconds / (60 * 60));
    if (time > 1) {
      return time + ' hours ago';
    }

    time = Math.floor(seconds / 60);
    if (time > 1) {
      return time + ' minutes ago';
    }

    return Math.floor(time) + ' seconds ago';
  }

  // Takes a tweet object and returns a tweet article element containing the
  // tweets entire HTML structure
  function createTweetElement(data) {
    const $tweet = $('<article>').addClass('tweet');
    const $header = $('<header>');
    const $content = $('<p>');
    const $footer = $('<footer>');
    const tweetAge = timeSince(data.created_at);

    // Add data into header section of tweet
    $('<img>').attr('src', data.user.avatars.small).appendTo($header);
    $('<h2>').text(data.user.name).appendTo($header);
    $('<p>').text(data.user.handle).appendTo($header);

    // Add tweet text content
    $content.text(data.content.text);

    // Add data into footer section of tweet
    $('<small>').text(tweetAge).appendTo($footer);
    $('<i>').addClass('fas fa-heart').appendTo($footer);
    $('<i>').addClass('fas fa-retweet').appendTo($footer);
    $('<i>').addClass('fas fa-flag').appendTo($footer);

    return $tweet.append(
        $header,
        $content,
        $footer
      );
  }

  // Takes in an array of tweet objects and appends each one to the
  // tweets-container section
  function renderTweets(tweets) {
    const $tweetsContainer = $('#tweets-container');

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

  loadTweets();

  $('.new-tweet form').on('submit', function(event) {
    event.preventDefault();

    const $this = $(this);
    const $input = $this.serialize();

    $.ajax({
      url: '/tweets',
      method: 'POST',
      data: $input,
      success: function(tweets, status) {
        console.log('saved' + tweets + ', ' + status);
      }
    });


  });


});