var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  sender : {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [{
    message: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Message', messageSchema);
