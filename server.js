// Dependencies
const express = require("express");
const mongojs = require("mongojs");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

// Database configuration
const databaseUrl = "kare11db";
const collections = ["kareHeadlines"];
const db = mongojs(databaseUrl, collections);
db.on("error", (error) => {
  console.log("Database Error:", error);
});

// Scrapping function
axios.get("https://www.kare11.com/").then((res) => {
    const $ = cheerio.load(res.data);

    $("li.headline-list-with-abstract__item").each((i, element) => {
        const title = $(element).children().text();
        const link = $(element).find("a").attr("href");
        const summery = $(element).children().children().text();

        db.kareHeadlines.save({
            title: title,
            link: link,
            summery: summery
        });
    });
});


// Listen on port 3000
app.listen(3000, () => {
    console.log("App running on port 3000!");
  });