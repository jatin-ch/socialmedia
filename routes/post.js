var router = require('express').Router();
var Post = require('../models/post');
var Purifier = require('html-purify');
var date = require('date-and-time');
var multer = require('multer');
var upload = multer({dest: 'public/uploads'});
var Postlike = require('../models/postlike');



router.get('/', function(req, res, next){
  Post.find({})
      .populate('author')
      .exec(function(err, posts){
        if(err) return next(err);
        var jat = new Post();
        res.render('index', { message: req.flash('success'), posts: posts, date: date , jat:jat});
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
  Post.remove({_id: req.params.id}, function(err){
    if(err) return next(err);
    req.flash('success', 'Post was deleted');
    return res.redirect('/');
  })
});

router.post('/like/:id', function(req, res, next){
  Post.findOne({ _id: req.params.id, 'likes._id': req.user._id }, function(err, post) {
    if(err) return next(err);

    if(post) {
      post.likes.pull({ _id: req.user._id});

      post.save(function(err){
            if(err) return next(err);
            req.flash('success', 'You unliked this post');
            return  res.redirect('/');
          });

    } else {
      Post.findById(req.params.id, function(err, post) {
        if(err) return next(err);

        post.likes.push({
          islike: true,
          _id: req.user
        });

        post.save(function(err){
              if(err) return next(err);
              req.flash('success', 'You liked this post');
              return  res.redirect('/');
            });
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
            res.json(post.likes.length); //return  true;
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
              res.json(post.likes.length); ////return  true;
            });
      });
    }

  });
});


module.exports = router;
