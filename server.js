// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/cdsdb";
mongoose.connect(MONGODB_URI);

// Scrapping functions
app.get("/scrape", (req, res) => {
axios.get("https://minnesota.cbslocal.com/").then((response) => {
    let $ = cheerio.load(response.data);

    $("a.cbs-thumbnail-link.content-type-video").each((i, element) => {
        let result = {};
        result.title = $(element).attr("title");
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
        return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
      })
      .then((dbHeadline) => {
        res.json(dbHeadline);
      })
      .catch((err) => {
        res.json(err);
      });
  });

// Route for grabbing a specific Headline by id, populate it with it's comments
app.get("/headline/:id", (req, res) => {
    db.Headline.findOne({ _id: req.params.id })
      .populate("comment")
      .then((dbHeadline) => {
        res.json(dbHeadline);
      })
      .catch((err) => {
        res.json(err);
      });
  });

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
