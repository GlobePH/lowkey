const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

var ThreadSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  thread_title: { type: String, required: true, trim: true },
  thread_content: {type: String, required: true, trim: true},
  thread_category: {type: String, required: true, trim: true}
});

var Thread = mongoose.model('Thread', ThreadSchema);

module.exports  = { Thread };
