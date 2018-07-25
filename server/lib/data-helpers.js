'use strict';

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

    // Find liked tweet based on timestamp and increment/decrement likes counter
    changeTweetLikes: function(tweetId, adjustment, callback) {
      db.collection('tweets').find().toArray((err, tweets) => {
        let likedTweet = tweets.filter((tweet) => {
          return tweet._id == tweetId;
        })[0];

        if (adjustment > 0) {
          db.collection('tweets').updateOne(likedTweet, {$inc: {likes: 1}});
        } else {
          db.collection('tweets').updateOne(likedTweet, {$inc: {likes: -1}});
        }

        callback();
      });
    }

  }
}