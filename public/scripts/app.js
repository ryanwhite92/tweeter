/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.
const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": {
      "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
      "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
      "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
    },
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
}



$(document).ready(function() {

  // Takes a tweet object and returns a tweet article element containing the
  // tweets entire HTML structure
  function createTweetElement(data) {
    var $article = $('<article>').addClass('tweet');
    var $header = $('<header>').appendTo($article);
    var $content = $('<p>').text(data.content.text).appendTo($article);
    var $footer = $('<footer>').appendTo($article);
    //var timeAgo

    // Add data into header section of tweet
    $('<img>').attr('src', data.user.avatars.small).appendTo($header);
    $('<h2>').text(data.user.name).appendTo($header);
    $('<p>').text(data.user.handle).appendTo($header);

    // Add data into footer section of tweet
    $('<small>').text(data.created_at).appendTo($footer);
    $('<i>').attr('class', 'fas fa-heart').appendTo($footer);
    $('<i>').attr('class', 'fas fa-retweet').appendTo($footer);
    $('<i>').attr('class', 'fas fa-flag').appendTo($footer);

    return $article;
  }

  var $tweet = createTweetElement(tweetData);
  console.log($tweet);
  var $tweetsContainer = $('#tweets-container').append($tweet);

});