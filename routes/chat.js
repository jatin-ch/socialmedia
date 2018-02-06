var router = require('express').Router();
var User = require('../models/user');
var Message = require('../models/message');

router.get('/chats', function(req, res, next) {
  User.find({}, function(err, users) {
    if(err) return err;

    Message.find({})
           .populate('sender')
           .populate('receiver')
           .exec(function(err, messages) {
            res.render('chat', { users: users, messages: messages});
          });
  });
});

router.post('/chats', function(req, res, next) {
  Message.findOne({ sender: req.user, receiver: req.body.receiver }, function(err, message) {
    if(err) return err;

    if(message) {
      message.messages.push({ message: req.body.message });

      message.save(function(err) {
        if(err) return next(err);
        var result = req.body.message;
        res.json(result);
      });
    }else {
      var message = new Message();
      message.sender = req.user;
      message.receiver = req.body.receiver;
      message.messages.push({ message: req.body.message });

      message.save(function(err) {
        if(err) return next(err);
        var result = req.body.message;
        res.json(result);
      });
    }
  });
});


module.exports = router;
