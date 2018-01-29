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
  }]
},
{
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
