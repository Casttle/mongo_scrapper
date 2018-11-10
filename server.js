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
mongoose.connect("mongodb://localhost/cbsdb", { useNewUrlParser: true });


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

// app.get("/scrape", function(req, res) {
//     // First, we grab the body of the html with axios
//     axios.get("http://www.echojs.com/").then(function(response) {
//       // Then, we load that into cheerio and save it to $ for a shorthand selector
//       var $ = cheerio.load(response.data);
  
//       // Now, we grab every h2 within an article tag, and do the following:
//       $("article h2").each(function(i, element) {
//         // Save an empty result object
//         var result = {};
  
//         // Add the text and href of every link, and save them as properties of the result object
//         result.title = $(this)
//           .children("a")
//           .text();
//         result.link = $(this)
//           .children("a")
//           .attr("href");
  
//         // Create a new Article using the `result` object built from scraping
//         db.Headline.create(result)
//           .then(function(dbArticle) {
//             // View the added result in the console
//             console.log(dbArticle);
//           })
//           .catch(function(err) {
//             // If an error occurred, send it to the client
//             return res.json(err);
//           });
//       });
  
//       // If we were able to successfully scrape and save an Article, send a message to the client
//       res.send("Scrape Complete");
//     });
//   });
  



// Routes
app.get("/", (req, res) => {
    res.send(index.html);
});

app.get("/all", (req, res) => {
    db.Headline.find({}).then((dbHeadline) => {
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
