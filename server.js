// Dependencies
const express = require("express");
// const mongojs = require("mongojs");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Database configuration
// const databaseUrl = "cbsdb";
// const collections = ["cbsHeadlines"];
// const db = mongojs(databaseUrl, collections);

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/cbsdb", { useNewUrlParser: true });

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/cdsdb";

mongoose.connect(MONGODB_URI);


// Scrapping functions
app.get("/scrape", (req, res) => {
axios.get("https://minnesota.cbslocal.com/").then((response) => {
    let $ = cheerio.load(response.data);

    $("a.cbs-thumbnail-link.content-type-video").each((i, element) => {
        let result = {};
        result.title = $(element).children().text();
        result.link = $(element).attr("href");
        result.summery = $(element).find("em").text();

        db.Headline.create(result)
          .then((dbHeadline) => {
            console.log(dbHeadline);
          })
          .catch((err) => {
            return res.json(err);
          });
    });
    res.send("Scrape Complete");
});
});


//------------------Routes-----------------------------------
// Main Page
app.get("/", (req, res) => {
    res.send(index.html);
});

// Get all Headlines acquired from the scrapper
app.get("/all", (req, res) => {
    db.Headline.find({})
    .then((dbHeadline) => {
      res.json(dbHeadline);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Route for saving/updating a Headline's associated Comment
app.post("/headline/:id", (req, res) => {
    // Create a new Comment and pass the req.body to the entry
    db.Comment.create(req.body)
      .then((dbComment) => {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
      })
      .then((dbHeadline) => {
        res.json(dbHeadline);
      })
      .catch((err) => {
        res.json(err);
      });
  });

// Route for grabbing a specific Headline by id, populate it with it's comment
app.get("/headline/:id", (req, res) => {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Headline.findOne({ _id: req.params.id })
      .populate("comment")
      .then((dbHeadline) => {
        res.json(dbHeadline);
      })
      .catch((err) => {
        res.json(err);
      });
  });




// Listen on port 3000
app.listen(3000, () => {
    console.log("App running on port 3000!");
});
