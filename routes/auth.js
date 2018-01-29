router = require('express').Router();
var passport = require('passport');
var passportConfig = require('../config/passport');
var User = require('../models/user');

const nodemailer = require('nodemailer');

router.get('/nodemailer', function(req, res){
  let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'lbqfpg37k5t4lrlb@ethereal.email',
          pass: 'EjJqPyfCRMCqfm4fQd'
        },
        tls: {
          rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Moolchand Jat " <atr.moolchand@gmail.com>', // sender address
        to: 'moolchandjatjiit@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('email has been sent');
    });
})

router.get('/login', function(req, res){
  if(req.user) return res.redirect('/');
  res.render('auth/login', { message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/profile', function(req, res, next){
  User.findOne({ _id:req.user._id }, function(err, user){
    if(err) return next(err);
    res.render('auth/profile', { user: user });
  });
});

router.get('/signup', function(req, res, next){
  res.render('auth/signup', {errors: req.flash('errors')});
});

router.post('/signup', function(req, res, next){
  var user = new User();
  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.mobile = req.body.mobile;
  user.password = req.body.password;
  user.profile.picture = user.gravatar();


  User.findOne({ email:req.body.email }, function(err, existingUser){
    if(existingUser){
      req.flash('errors','User with that email address already exists');
      return res.redirect('/signup');
    } else {
      user.save(function(err, user){
        if(err) return next(err);

        req.logIn(user, function(err){
          if(err) return next(err);
          res.redirect('/profile')
        });
      });
    }
  });
});

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/login');
});

router.get('/edit-profile', function(req, res, next){
  res.render('auth/edit-profile', { message: req.flash('success')});
});

router.post('/edit-profile', function(req, res, next){
  User.findOne({ _id: req.user._id},  function(err, user){

    if(err) return next(err);

    if(req.body.name) user.profile.name = req.body.name;
    if(req.body.address) user.address = req.body.address;

    user.save(function(err){
      if(err) return next(err);
      req.flash('success', 'Your profile has been saved');
      return res.redirect('/edit-profile');
    });
  });
});

module.exports = router;
