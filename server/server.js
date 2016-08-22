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
app.use('/bower_components', express.static('./bower_components'));
app.get('/api/vids', function(req, res) {
  Promise.all([
      getDocs(),
      //getWierd(),
      //getVids()
      //getAll()
    ])
    .then(function() {
      var newArr = _.shuffle(videos);
      //var newArr = videos;
      videos = [];
      res.json(newArr);
    })
});
app.get('/api/change', function(req, res) {
  console.log(req.params)
  var subreddit = req.query.sub;
  var time = req.query.time;
  var sort = req.query.sort;
  Promise.all([
      getVids(subreddit, sort, time, 10),
    ])
    .then(function() {
      var newArr = videos;
      //var newArr = videos;
      videos = [];
      res.json(newArr);
    })
});

// API stuff
// var categories = ['videos', 'documentaries', 'awwvideos', 'educativevideos',
//   'interdimensionalcable', 'politicalvideos', 'politicalvideo', 'sportsvideos', 'foodvideos'
//   'cookingvideos', 'musicvideos'];

var categories = ['videos', 'documentaries', 'awwvideos', 'sportsvideos',
  'cookingvideos', 'musicvideos'
];
var timePeriod = 'month';
var sortBy = 'top';
var vidCount = 1;
var videos = [];

function pushVideos(data) {
  for (var i = 0; i < data.data.children.length; i++) {
    if (data.data.children[i].data.url.includes("https://www.youtube.com/watch?v=") ||
      data.data.children[i].data.url.includes("https://youtu.be/")) {
      var videoObject = {};
      videoObject.title = data.data.children[i].data.title;
      videoObject.url = data.data.children[i].data.url;
      videoObject.thumb = data.data.children[i].data.thumbnail;
      videoObject.score = data.data.children[i].data.score;
      videoObject.subreddit = data.data.children[i].data.subreddit;
      videoObject.link = 'http://www.reddit.com' + data.data.children[i].data.permalink;
      if (data.data.children[i].data.url.includes("https://www.youtube.com/watch?v=")) {
        videoObject.id = data.data.children[i].data.url.slice(32, 43);
      }
      if (data.data.children[i].data.url.includes("https://youtu.be/")) {
        videoObject.id = data.data.children[i].data.url.slice(17, 28);
      }
      videos.push(videoObject);
    }
  }
}

function getDocs() {
  return new Promise(
    function(resolve, reject) {
      //var tempArray = _.shuffle(categories);
      reddit.r('videos').sort('top').from('month').limit(10, function(err, data, res) {
        //console.log(data.data.children);
        pushVideos(data)
        resolve(data);
        reject(err);
      });
    });
}

function getVids(subreddit, sortBy, timePeriod, vidCount) {
  return new Promise(
    function(resolve, reject) {
      reddit.r(subreddit).sort(sortBy).from(timePeriod).limit(vidCount, function(err, data, res) {
        //console.log(data.data.children);
        pushVideos(data)
        resolve(data);
        reject(err);
      });
    });
}

app.listen(port);
console.log('Listening @ http://localhost:' + port);
