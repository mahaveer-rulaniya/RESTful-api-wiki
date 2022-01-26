const express = require("express"); //Loading modules from express

//npm library used to process data sent through http requests
const bodyParser = require("body-parser"); 

const mongoose = require("mongoose");// Using Mongoose npm package for handling MongoDB Database
const _ = require("lodash");//Require lodash for addind some javascript functionalities

const app = express(); // create application using express.js

app.set('view engine', 'ejs'); //use ejs module in the app

//transform url encoded request to JS accessible requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));//use static files in the app

//connecting to mongodb local server
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = { //creating schema
  title:String,
  content:String
};

const Article =mongoose.model("Article", articleSchema); //creating mongoose model

//Fetch all the articles
app.get("/articles", function(req, res){

   Article.find(function(err, foundArticles){
     if(!err){
      res.send(foundArticles);
     }else{
       res.send(err);
     }
   });
});

//Create a new article
app.post("/articles", function(req, res){

   const newArticle = new Article({
     title:req.body.title,
     content:req.body.content
   });
   newArticle.save(function(err){
     if(!err){
       res.send("Successfully added new article");
     }else{
       res.send(err);
     }
   });
});

// Delete all the articles
app.delete("/articles", function(req, res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Succesfully deleted all articles");
    }else{
      res.send(err);
    }
  });

});

////////////////////////////Requests targeting a specific article/////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

   Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("No article matching found");
      }
   });
})

.put(function(req, res){
    Article.updateMany(
      {title: req.params.articleTitle},
      {title:req.body.title, content: req.body.content},
      {overwrite:true},

      function(err){
            if(!err){
              res.send("Successfullly Updated");
            }
      }
    )
})

.patch(function(req, res){
   Article.updateOne(
     {title:req.params.articleTitle},
     {$set : req.body},
     function(err){
       if(!err){
         res.send("Success update");
       }else{
         res.send(err);
       }
     }
   )
})

.delete(function(req, res){
   Article.deleteOne(
     {title:req.params.articleTitle},
     function(err){
       if(!err){
         res.send("Sucessfull deleted one article");
       }else{
         res.send(err);
       }
     }
   )
});

//used to bind and listen the connections on the specified host and port
app.listen(3000, function () {
  console.log("Server started on port 3000");
});


