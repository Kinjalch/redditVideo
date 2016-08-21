var express = require('express');
var request = require('request');
var reddit = require('redwrap');
var _ = require('underscore');

var app = express();

var port = process.env.PORT || 1337;

app.get('/', function(req, res){
  res.send('hello');
});

var videos = [];
function pushVideos(data){
  for(var i = 0; i < data.data.children.length; i++){
    videos.push(data.data.children[i].data.title+'('+data.data.children[i].data.subreddit+')');
  }
}
function getDocs() {
  return new Promise(
    function(resolve, reject) {
      reddit.r('documentaries').sort('top').from('year').limit(5, function(err, data, res){
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
      reddit.r('interdimensionalcable').sort('top').from('year').limit(5, function(err, data, res){
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
      reddit.r('videos').sort('top').from('year').limit(5, function(err, data, res){
        //console.log(data.data.children);
        pushVideos(data)
        resolve(data);
        reject(err);
      });
    });
}
Promise.all([
    getDocs(),
    getWierd(),
    getVids()
])
.then(function(){
  var newArr = _.shuffle(videos);
  console.log(newArr);
})
var tmp = [1,2,3,4,5];
console.log(_.shuffle(tmp));
// getVids()
// .then(function(data){
//   console.log('in then');
//   console.log(videos);
// })
// .catch(function(err){
//   console.log("error: ", err);
// })
// var url = 'https://www.reddit.com/r/documentaries/top.json?sort=top&t=all';
// var videoList;
//
// var setList = function(body){
//   videoList = JSON.parse(body).data.children;
//
//   for(var i = 0; i < videoList.length; i++){
//     console.log(videoList[i].data.title);
//     console.log(videoList[i].data.url+'\n');
//   }
// }
//
// request(url , function (error, response, body){
//   if (!error && response.statusCode == 200) {
//     //videoList = JSON.parse(body).data.children;
//     setList(body);
//   }
// })


app.listen(port);
console.log('Listening @ http://localhost:' + port);
