const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

var EpisodeSchema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  episode_title: { type: String, required: true, trim: true },
  episode_description: {type: String, required: true, trim: true},
  magnet: {type: String, required: true, trim: true}
});

var Episode = mongoose.model('Episode', EpisodeSchema);

module.exports  = { Episode };
