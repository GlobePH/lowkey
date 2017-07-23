const {Episode} = require('./../models/episode');

exports.getMagnetApi = (req, res) => {
  var request_id = req.params.id;
  Episode.findOne({'_id':request_id}).then((doc) => {
    res.send(doc);
  }).catch((e) => {
    res.send(e);
  });
};
