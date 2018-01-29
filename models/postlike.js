var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostlikeSchema = new Schema({
  islike: {
    type: Boolean,
    default: false
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Postlike', PostlikeSchema);
