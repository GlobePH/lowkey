const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: 'not valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  name: {
    type: String,
    minlength: 1,
    required: true
  }
});

UserSchema.statics.findByCredentials = function (email, password) {
  var user = this;
  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject('User does not exist');
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject('Password does not match');
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports  = { User };
