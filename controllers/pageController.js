const _ = require('lodash');
const {Post} = require('./../models/post');
const {Episode} = require('./../models/episode');
const {TakenCourse} = require('./../models/takencourse');
const {Thread} = require('./../models/thread');
const fs = require('fs');
const createTorrent = require('create-torrent');
const WebTorrent = require('webtorrent-hybrid');

//configurations

exports.getHomepage = (req, res) => {
  session = req.session;
  Post.find({}, (err, doc) => {
    res.render('index.hbs', {
      session: session,
      doc
    });
  });
};

exports.getCommunity = (req, res) => {
  session = req.session;
  Thread.find({}, (err, doc) => {
    res.render('community.hbs', {
      session,
      doc
    })
  });
}

exports.getMyCourses = (req, res) => {
  session = req.session;
  TakenCourse.findOne({'user_id':session.user._id}, (err, doc) => {
    res.render('mycourses.hbs', {
      session: session,
      doc
    });
  });
}

exports.getMyProfile = (req, res) => {
  session = req.session;
  res.render('profile.hbs', {
    session: session
  });
}

exports.getLogout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}

exports.getCoursesNoParam = (req, res) => {
  res.redirect('/');
}

exports.getCoursesWithParam = (req, res) => {
  session = req.session;
  var course_id = req.params.id;
  Post.findOne({'_id':course_id}, (err, doc) => {
    Episode.find({'course_id':course_id}, (epiErr, epiDoc) => {
      res.render('course.hbs', {
        session: session,
        params: req.params,
        epiDoc,
        doc
      });
    });
  });
  //print sa course.hbs
}

exports.getUploadCourse = (req, res) => {
  session = req.session;
  res.render('uploadcourse.hbs', {
    session: session,
    params: req.params
  });
}

exports.postUploadCourse = (req, res) => {
  session = req.session;
  var body = _.pick(req.body, ['post_title', 'post_description']);
  var url = encodeURI(body.post_title);
  var author = session.user._id;
  var post = new Post();
  var input = {
    user_id: author,
    post_title: body.post_title,
    post_description: body.post_description,
    post_url: url
  }
  post.details.push(input);
  post.save().then((doc) => {
    var targetDir = 'public/uploads/' + post._id;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }
    var course_cover = req.files.course_cover;
    var file_path = targetDir + '/image.jpg';
    course_cover.mv(file_path, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      res.redirect('/myuploads');
    });
  });
}

exports.getMyUploads = (req, res) => {
  session = req.session;
  var resultDoc;
  Post.find({'details.user_id' : session.user._id}, (err, doc) => {
    res.render('myuploads.hbs', {
      session: session,
      doc
    });
  });
}

exports.getEditUpload = (req, res) => {
  session = req.session;
  var upload_id = req.params.id;
  Post.findOne({'_id':upload_id}, (err, doc) => {
    Episode.find({'course_id':upload_id}, (epiErr, epiDoc) => {
      res.render('editcourse.hbs', {
        session: session,
        doc,
        success: req.flash('success'),
        epiDoc
      });
    });
  });
}

exports.postEditUpload = (req, res) => {
  session = req.session;

  if (!req.files) {
    return res.status(400).send('No files has been uploaded');
  }

  let body = _.pick(req.body, ['magnet', 'course_id', 'episode_title', 'episode_description']);
  var episode = new Episode(body);

  episode.save().then((doc) => {
    var targetDir = 'public/uploads/' + episode._id;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }
    var episode_cover = req.files.episode_cover;
    var file_path = targetDir + '/image.jpg';
    episode_cover.mv(file_path, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      req.flash('success', 'Episode has been uploaded');
      res.redirect(`/myuploads/${body.course_id}`);
    });
  });
}

exports.getWatch = (req, res) => {
  session = req.session;
  var episode_id = req.params.id;
  Episode.findOne({'_id':episode_id}, (err, episode) => {
    Episode.find({'course_id':episode.course_id}, (manyErr, episodes) => {
      res.render('watch.hbs', {
        session,
        episode,
        episodes
      });
    });
  });
};

exports.getStartCourse = (req, res) => {
  session = req.session;
  var course_id = req.params.id;

  Post.findOne({_id:course_id}, (err, doc) => {
    TakenCourse.findOne({'user_id':session.user._id}, (takenErr, takenDoc) => {
      if (takenDoc) {
        TakenCourse.findByIdAndUpdate(takenDoc._id,{$push: {"courses": {
          course_id,
          course_title: doc.details[0].post_title,
          course_description: doc.details[0].post_description
        }}},{safe: true, upsert: true}, (findErr, findDoc) => {
          if (findErr) {
            console.log(findErr);
          }
        });
        res.redirect('/mycourses');
      } else {
        var construct = {
          user_id: session.user._id,
          courses: []
        };
        construct.courses.push({
          course_id,
          'course_title': doc.details[0].post_title,
          'course_description':  doc.details[0].post_description
        });
        var start_course = new TakenCourse(construct);
        start_course.save().then((doc) => {
          res.redirect('/mycourses');
        });
      }
    });
  });

};

exports.getEnrolledCourse = (req, res) => {
  session = req.session;
  var course_id = req.params.id;
  Post.findOne({'_id':course_id}, (err, doc) => {
    Episode.find({'course_id':course_id}, (epiErr, epiDoc) => {
      res.render('enrolled.hbs', {
        session: session,
        params: req.params,
        epiDoc,
        doc
      });
    });
  });
};

exports.getCreateThread = (req, res) => {
  session = req.session;
  res.render('createthread.hbs', {
    session: session
  });
};

exports.postCreateThread = (req, res) => {
  session = req.session;
  var form_val = _.pick(req.body,['thread_title','thread_content','thread_category']);
  var thread = new Thread({
    user_id: req.session.user._id,
    thread_title: form_val.thread_title,
    thread_content: form_val.thread_content,
    thread_category: form_val.thread_category
  });
  thread.save().then((doc) => {
    res.redirect('/community');
  });

};
