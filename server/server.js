var express = require('express');
var request = require('request');

var app = express();

var port = process.env.PORT || 1337;

app.get('/', function(req, res){
  res.send('hello');
});

var url = 'https://www.reddit.com/r/documentaries/top.json?sort=top&t=all';
var videoList;

var setList = function(body){
  videoList = JSON.parse(body).data.children;

  for(var i = 0; i < videoList.length; i++){
    console.log(videoList[i].data.title);
    console.log(videoList[i].data.url+'\n');
  }
}

request(url , function (error, response, body){
  if (!error && response.statusCode == 200) {
    //videoList = JSON.parse(body).data.children;
    setList(body);
  }
})


app.listen(port);
console.log('Listening @ http://localhost:' + port);
