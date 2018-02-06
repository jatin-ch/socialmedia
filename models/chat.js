var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
  messages : [{
    sender : {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
})

module.exports = mongoose.model('Message', messageSchema);
