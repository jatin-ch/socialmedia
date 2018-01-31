var router = require('express').Router();
var Post = require('../models/post');
var Purifier = require('html-purify');
var date = require('date-and-time');
var multer = require('multer');
var fs = require('fs');
var validator = require('youtube-validator');
var upload = multer({dest: 'public/uploads'});



router.get('/', function(req, res, next){
  Post.find({})
      .populate('author')
      .populate('comments.commentby')
      .exec(function(err, posts){
        if(err) return next(err);
        res.render('index', { message: req.flash('success'), posts: posts, date: date});
      });
});

router.post('/posts', upload.any(), function(req, res, next){
  var post = new Post();
  var purifier = new Purifier();
  post.body = purifier.purify(req.body.body);
  post.author = req.user;

  if(req.files){
    req.files.forEach(function(file){
      if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        post.image = file.filename; //(new Date).valueOf()+"-"+file.originalname
      }
    });
    }

    post.save(function(err){
      if(err) return next(err);
      req.flash('success', 'Successfully added a post');
      return res.redirect('/');
    });
});

router.post('/posts/:id', upload.any(), function(req, res, next) {
  Post.findById(req.params.id, function(err, post){
    if(err) return next(err);
    var purifier = new Purifier();
    post.body = purifier.purify(req.body.body);

    if(req.files){
      req.files.forEach(function(file){
        if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
          post.image = file.filename;
        }
      });
      }

    post.save(function(err){
      if(err) return next(err);
      req.flash('success', 'Post was saved successfully');
      return res.redirect('/');
    });
  });
});

router.post('/posts/delete/:id', function(req, res, next){
  Post.findById(req.params.id, function(err, post) {
    if(err) return next(err);

    if(post.image){
      fs.unlink('public/uploads/'+post.image, function(err){
        if (err) throw err;
        console.log('file successfully deleted!');

        Post.remove({_id: req.params.id}, function(err){
          if(err) return next(err);
          req.flash('success', 'Post was deleted');
          return res.redirect('/');
        })
      });
    }

  });
});


router.post('/mool/like', function(req, res, next) {
  Post.findOne({ _id: req.body.id, 'likes._id': req.user._id }, function(err, post) {
    if(err) return next(err);

    if(post) {
      post.likes.pull({ _id: req.user._id});

      post.save(function(err){
        if(err) return next(err);
        var result = {};
        result.cnt = post.likes.length;
        result.bool = false;
        res.json(result); ////return  true;
      });

    } else {
      Post.findById(req.body.id, function(err, post) {
        if(err) return next(err);

        post.likes.push({
          islike: true,
          _id: req.user
        });

        post.save(function(err){
          if(err) return next(err);
          var result = {};
          result.cnt = post.likes.length;
          result.bool = true;
          res.json(result); ////return  true;
        });
      });
    }

  });
});


router.post('/mool/comment', function(req, res, next) {
  Post.findById(req.body.id, function(err, post) {
    if(err) return next(err);

    console.log(post);

    post.comments.push({
      commentby: req.user,
      comment: req.body.comment
    });

    post.save(function(err){
      if(err) return next(err);
        var result = {};
        result.cnt = post.comments.length;
        result.comment = req.body.comment;
        res.json(result);
    });

  });
});



module.exports = router;
