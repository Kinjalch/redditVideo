var redditVideo = angular.module('redditVideo', ['youtube-embed'])
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['**']);
  })
  .factory('Videos', function($http) {
    function getVids() {
      return $http({
          method: 'GET',
          url: '/api/vids'
        })
        .then(function(resp) {
          return resp.data;
        })
        .catch(function(error) {
          console.log("error: ", error);
        });
    };

    function change(sub, time, sort) {
      var params = {
        sub: sub,
        time: time,
        sort: sort
      }
      return $http({
          method: 'GET',
          url: '/api/change',
          params: params
        })
        .then(function(resp) {
          return resp.data;
        })
        .catch(function(error) {
          console.log("error: ", error);
        });
    };
    return {
      getVids: getVids,
      change: change
    }
  })
.constant('_',
    window._
)
.controller('VideoController', function($scope, $window, Videos) {
  $scope.loading = true;
  $scope.videoList;
  $scope.currentVid;

  // dropdown menu options
  $scope.subreddits = ['videos', 'documentaries', 'awwvideos', 'funnyvideos', 'educativevideos',
    'interdimensionalcable', 'politicalvideos', 'politicalvideo', 'foodvideos',
    'cookingvideos', 'musicvideos'
  ];
  $scope.timePeriods = ['all', 'year', 'month', 'week', 'day'];
  $scope.sortBy = ['top', 'new', 'hot'];

  // menu selections
  $scope.selectedSortBy;
  $scope.selectedPeriod;
  $scope.selectedSubreddit;

  // player stuff
  $scope.$on('youtube.player.ready', function($event, player) {
    player.playVideo();
  });

  $scope.$on('youtube.player.ended', function($event, player) {
    $scope.currentVid = $scope.videoList.shift();
    player.playVideo();
  });

  $scope.play = function(video) {
    $scope.currentVid = video;
    var tmpArr = [];
    for (var i = 0; i < $scope.videoList.length; i++) {
      if ($scope.videoList[i] === video) continue;
      tmpArr.push($scope.videoList[i]);
    }
    $scope.videoList = tmpArr;
    $window.scrollTo(0, 0);
  };

  // playlist stuff
  $scope.shuffle = function(){
    var temp = _.shuffle($scope.videoList);
    $scope.videoList = temp;
  }
  $scope.change = function() {
    if ($scope.selectedSubreddit || $scope.selectedPeriod || $scope.selectedSortBy) {
      $scope.loading = true;
      $scope.videoList = [];
      Videos.change($scope.selectedSubreddit, $scope.selectedPeriod, $scope.selectedSortBy)
        .then(function(vids) {
          $scope.loading = false;
          $scope.videoList = vids;
          $scope.currentVid = $scope.videoList.shift();

        })
        .catch(function(error) {
          console.log("error: ", error);
        });
    }
  }

  function getVids() {
    Videos.getVids()
      .then(function(vids) {
        $scope.loading = false;
        $scope.videoList = vids;
        $scope.currentVid = $scope.videoList.shift();
      })
      .catch(function(error) {
        console.log("error: ", error);
      });
  }
  getVids();

});
