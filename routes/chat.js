var router = require('express').Router();
var User = require('../models/user');
var Message = require('../models/chat');

router.get('/chats', function(req, res, next) {
  User.find({}, function(err, users) {
    if(err) return err;
    res.render('chat', { users: users });
  });
});

router.post('/chats/push', function(req, res, next) {
  Message.findOne({ $or: [
    { $and: [ {'messages.sender': req.user}, {'messages.receiver': req.body.receiver} ] },
    { $and: [ {'messages.receiver': req.user}, {'messages.sender': req.body.receiver} ] }
  ]}, function(err, message) {
    if(err) return err;

    if(message) {
      message.messages.push({
        sender: req.user,
        receiver: req.body.receiver,
        message: req.body.message
      });

      message.save(function(err) {
        if(err) return next(err);
        var result = req.body.message;
        res.json(result);
      });
    }else {
      var message = new Message();
      message.messages.push({
        sender: req.user,
        receiver: req.body.receiver,
        message: req.body.message
      });

      message.save(function(err) {
        if(err) return next(err);
        var result = req.body.message;
        res.json(result);
      });
    }
  });
});


router.post('/chats', function(req, res, next) {
  Message.find({ 'messages.sender': req.user, 'messages.receiver': req.body.receiver })
          .populate('messages.sender')
          .populate('messages.receiver')
          .exec(function(err, messages) {
    if(err) return next(err);
    var result = [];
    for(var i = 0; i < messages.length; i++) {
      for(var j = 0; j < messages[i].messages.length; j++) {
        result.push({
          sender: messages[i].messages[j].sender,
          receiver: messages[i].messages[j].receiver,
          message: messages[i].messages[j].message,
          user: req.user,
        })
      }
    }
    res.json(result);
  })
})

module.exports = router;
