"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const {MongoClient} = require('mongodb');
const app           = express();
const MONGODB_URI   = 'mongodb://localhost:27017/tweeter';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.log(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  // Pass mongodb database into DataHelpers to provide an interface to the
  // tweets db
  const DataHelpers = require("./lib/data-helpers.js")(db);

  // Define routes that use DataHelpers interface to interact with the db
  const tweetsRoutes = require("./routes/tweets")(DataHelpers);

  // Mount the tweets routes at the "/tweets" path prefix:
  app.use("/tweets", tweetsRoutes);

  //db.close();
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
