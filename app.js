//Requirements
const express = require("express");
const app = express();

const ejs = require("ejs");
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("Public"));

const mongoose = require("mongoose");

//Database
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

////////////////// Requests Targetting All Article ////////////////////

app.route("/articles")
.get(function(req, res){
    Article.find({}, function(err, foundArticles){
        if (!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})
.post(function(req, res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if (!err){
            res.send("Succesfully added new article.")
        } else {
            console.log(err);
        }
    });
})
.delete(function(req, res){
    Article.deleteMany({}, function(err){
        if (!err){
            res.send("Succesfully deleted all articles.")
        } else {
            res.send(err);
        }
    });
});

////////////////// Requests Targetting A Specific Article ////////////////////

app.route("/articles/:subTopic")
.get(function(req, res){
    const subTopicName = req.params.subTopic;
    Article.findOne({title: subTopicName}, function(err, foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else if (err) {
            res.send(err);
        } else {
            res.send("No such article found.")
        }
    });
})
.put(function(req,res){
    Article.replaceOne(
        {title: req.params.subTopic},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        function(err){
            if (!err){
                res.send("Succesfully updated article.");
            } else {
                console.log(err);
            }
        }
    )
})
.patch(function(req, res){
    Article.updateOne(
        {title: req.params.subTopic},
        {$set: req.body},
        function(err){
            if (!err){
                res.send("Article updated succesfully.");
            } else {
                console.log(err);
            }
        }
    )
})
.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.subTopic},
        function(err){
            if (!err){
                res.send("Successfully deleted the article.");
            } else {
                console.log(err);
            }
        }
    );
});

//Port
app.listen(3000, function(){
    console.log("Server is sucessfully started.")
});