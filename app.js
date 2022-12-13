//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleschema = {
  title:String,
  content:String
}
const Article = mongoose.model("Article",articleschema);



/////////////////////////////////////////////////////////////////////////////////All Article API/////////////////////////////////////////////////////////////////////////////
app.route("/articles")
.get(function(req , res){
  Article.find(function(err , foundArticles){
    if (!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.post(function(req , res){
  // console.log(req.body.title);
  // console.log(req.body.content);

  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if (!err) {
      res.send("Successfully added new articles");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req , res){
  Article.deleteMany(function(err){
  if (!err) {
    res.send("Successfully deleted all the articles");
  } else {
    res.send(err);
  }
  });
});



/////////////////////////////////////////////////////////////////////////////////Specific Article API/////////////////////////////////////////////////////////////////////////////

app.route("/articles/:articletitle")

.get(function(req , res){

Article.findOne({title:req.params.articletitle},function(err , foundArticle){

    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No article matching that title was found")
    }
  });
})

.put(function(req,res){
  Article.updateMany(
    {title:req.params.articletitle},
    {title:req.body.title, content:req.body.content},
    {
      overwrite:true},
    function(err){
      if (!err) {
        res.send("Successfully updated article");
        }
      }
    );
  })

  .patch(function(req,res){
    Article.update(
      {title: req.params.articletitle},
      {$set: req.body},
      function(err){
        if (!err) {
          res.send("Successfully updated article.")
        } else {
          res.send(err)
        }
      }
    );
  })

  .delete(function(req , res){
    Article.deleteOne({title:req.params.articletitle},function(err){
    if (!err) {
      res.send("Successfully deleted the articles");
    } else {
      res.send(err);
    }
    });
  });
//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
