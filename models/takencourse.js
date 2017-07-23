const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

var TakenCourse = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  courses: [{
    course_id: { type: String, required: true },
    course_title: {type: String, required: true},
    course_description: {type: String, required: true}
  }]
});

var TakenCourse = mongoose.model('TakenCourse', TakenCourse);

module.exports  = { TakenCourse };
