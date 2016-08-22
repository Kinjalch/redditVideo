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
    return {
      getVids: getVids
    }
  })
  .controller('VideoController', function($scope, $window, Videos) {
    $window.scope = $scope;
    $scope.loading = true;
    $scope.videoList;
    $scope.currentVid;

    $scope.$on('youtube.player.ready', function($event, player) {
      player.playVideo();
    });

    $scope.$on('youtube.player.ended', function($event, player) {
      $scope.currentVid = $scope.videoList.shift();
      player.playVideo();
    });

    $scope.play = function(video) {
      $scope.currentVid = video;
      $window.scrollTo(0, 0);
    };

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
