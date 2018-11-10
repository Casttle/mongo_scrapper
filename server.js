// Dependencies
const express = require("express");
const mongojs = require("mongojs");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.static("public"));

// Database configuration
const databaseUrl = "cbsdb";
const collections = ["cbsHeadlines"];
const db = mongojs(databaseUrl, collections);
db.on("error", (error) => {
    console.log("Database Error:", error);
});

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function (error) {
    console.log("Database Error:", error);
});

// Scrapping function
axios.get("https://minnesota.cbslocal.com/").then((res) => {
    const $ = cheerio.load(res.data);

    $("a.cbs-thumbnail-link.content-type-video").each((i, element) => {
        const title = $(element).children().text();
        const link = $(element).attr("href");
        const summery = $(element).find("em").text()

        db.cbsHeadlines.save({
            title: title,
            link: link,
            summery: summery
        });
    });
});

// Routes
app.get("/", (req, res) => {
    res.send(index.html);
});

app.get("/all", (req, res) => {
    db.cbsHeadlines.find({}, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(data);
        }
    });
});







// Listen on port 3000
app.listen(3000, () => {
    console.log("App running on port 3000!");
});
