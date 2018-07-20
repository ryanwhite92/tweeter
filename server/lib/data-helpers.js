"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insertOne(newTweet, callback);
    },

    getTweets: function(callback) {
      db.collection('tweets').find().toArray((err, tweets) => {
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, tweets.sort(sortNewestFirst));
      });
    },

    changeTweetLikes: function(time, callback) {
      // Find liked tweet based on timestamp and increment counter
      db.collection('tweets').find().toArray((err, tweets) => {
        let likedTweet = tweets.filter((tweet) => {
          return tweet.created_at == time;
        })[0];

        db.collection('tweets').updateOne(likedTweet, {$inc: {likes: 1}});
        callback();
      });
    }

  }
}