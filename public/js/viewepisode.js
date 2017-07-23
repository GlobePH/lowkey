var client = new WebTorrent();
var current_url = window.location.href;
var current_id = current_url.replace("http://localhost:3000/watch/", "");
var http_url = `http://localhost:3000/api/getmagnet/${current_id}`;
var output = document.getElementById("output-video");

$.ajax({url: http_url, success: function(result){
  client.add(result.magnet, function (torrent) {

    var file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4');
    });

    file.appendTo('#output-video',{
      autoplay: false
    });

  });
}});
