const mongoose = require('mongoose');
const validator = require('validator');

var PostSchema = new mongoose.Schema({
  details: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    post_title: { type: String, required: true, trim: true },
    post_description: {type: String, required: true, trim: true},
    post_url: {type: String, required: true, trim: true},
    post_likes: {type: Number, default: 0 }
  }]
});

var Post = mongoose.model('Post', PostSchema);

module.exports  = { Post };
