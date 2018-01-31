var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  body: {
    type: String
  },
  image: {
    type: String,
    default:''
  },
  video: {
    type: String,
    default: ''
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: [{
    // _id: false,
    islike: {
      type: Boolean,
      default: false
    },
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: false
    }
  }],
  comments: [{
    _id: false,
    commentby: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: false
    },
    comment: {
      type: String,
      default: ''
    },
    replies: [{
      _id: false,
      replyby: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: false
      },
      reply: {
        type: String,
        default: ''
      }
    }]
  }]
},
{
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
