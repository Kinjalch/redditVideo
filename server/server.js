var express = require('express');
var request = require('request');
var reddit = require('redwrap');
var _ = require('underscore');

var app = express();
var port = process.env.PORT || 1337;

// Middleware
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name');
  next();
});

// Routes
app.use(express.static('./client/'));
app.get('/api/vids', function(req, res) {
  Promise.all([
      getDocs(),
      //getWierd(),
      //getVids()
    ])
    .then(function() {
      var newArr = _.shuffle(videos);
      videos = [];
      res.json(newArr);
    })
});

// API stuff
var videos = [];
function pushVideos(data) {
  if(!data){

  }
  for (var i = 0; i < data.data.children.length; i++) {
    if( data.data.children[i].data.url.includes("https://www.youtube.com/watch?v=") ||
        data.data.children[i].data.url.includes("https://youtu.be/") ) {
      var videoObject = {};
      videoObject.title = data.data.children[i].data.title;
      videoObject.url = data.data.children[i].data.url;
      videoObject.thumb = data.data.children[i].data.thumbnail;
      videoObject.score = data.data.children[i].data.score;
      videoObject.subreddit = data.data.children[i].data.subreddit;
      if( data.data.children[i].data.url.includes("https://www.youtube.com/watch?v=") ){
        videoObject.id = data.data.children[i].data.url.slice(32);
      }
      if( data.data.children[i].data.url.includes("https://youtu.be/") ) {
        videoObject.id = data.data.children[i].data.url.slice(17);
      }
      videos.push(videoObject);
    }
  }
}

function getDocs() {
  return new Promise(
    function(resolve, reject) {
      reddit.r('documentaries').sort('top').from('month').limit(20, function(err, data, res) {
        //console.log(data.data.children);
        pushVideos(data)
        resolve(data);
        reject(err);
      });
    });
}

function getWierd() {
  return new Promise(
    function(resolve, reject) {
      reddit.r('interdimensionalcable').sort('top').from('week').limit(5, function(err, data, res) {
        //console.log(data.data.children);
        pushVideos(data)
        resolve(data);
        reject(err);
      });
    });
}

function getVids() {
  return new Promise(
    function(resolve, reject) {
      reddit.r('videos').sort('top').from('week').limit(5, function(err, data, res) {
        //console.log(data.data.children);
        pushVideos(data)
        resolve(data);
        reject(err);
      });
    });
}

app.listen(port);
console.log('Listening @ http://localhost:' + port);
