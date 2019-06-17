const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// scraping stuff
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models/Index");
// defines port we will be running on
const PORT = 3000;

// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// represents data in JSON format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// connects to db
mongoose.connect("mongodb://localhost/feedback", { useNewUrlParser: true });

app.get('/scrape', function(req,res){
    axios.get('https://www.newsobserver.com/')
    .then(function(response) {
        // shorthand that loads cheerio 
        const $ = cheerio.load(response.data);

        // identifies which information we want scraped
        $('.package h3').each(function(i, element){
            // stores the result for each scraped item
            let result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.story = $(this)
                .children("a")
                .text();
            result.summary = $(this)
                .children("a")
                .text();
            result.url = $(this)
                .children("a")
                .attr("href");

            db.Story.create(result)
                .then(function(dbStory) {
                // logs result for story
                console.log(dbStory);
                })
                .catch(function(err) {
                // logs error if found
                console.log(err);
                });
        })
        // displays scrape message to client
        res.send('All stories have been found')
    });
});

// grabs the stories from the DB
app.get('/feed', function(req, res){
    // find everything, format the results in JSON
    db.Story.find({})
        .then(function(dbStory){
            res.json(dbStory);
        })
        // display any errors to the client
        .catch(function(err){
            res.json(err);
        });
});

// grabs one story from id instead of an array
app.get('/feed/:id', function(req, res){
    db.Story.findOne({
        _id: req.params.id
    }).populate('summary')
    .then(function(dbStory){
        res.json(dbStory)
    })
    // display any errors to the client
    .catch(function(err){
        res.json(err);
    });
});

app.post('/feed/:id', function(req, res){
    db.Summary.create(req.body)
    // give back new summary that was created
        .then(function(dbSummary){
            // updates summary
            return db.Summary.findOneAndUpdate({ _id: req.params.id }, { note: dbSummary._id }, { new: true });
            // new: true forces the new summary to appear
        })
        .then(function(dbStory){
            res.json(dbStory);
        })
        // display any errors to the client
        .catch(function(err){
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});

