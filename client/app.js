var redditVideo = angular.module('redditVideo', [])
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
  .controller('VideoController', function($scope, Videos) {
    $scope.loading = true;
    $scope.videoList;
    $scope.currentVid;
    $scope.srcString;

    $scope.play = function(video) {
      $scope.currentVid = video;
      $scope.srcString = 'http://www.youtube.com/embed/' + $scope.currentVid.id + '?autoplay=1';
    };

    function getVids() {
      Videos.getVids()
        .then(function(vids) {
          $scope.loading = false;
          $scope.videoList = vids;
          $scope.currentVid = $scope.videoList.shift();
          $scope.srcString = 'http://www.youtube.com/embed/' + $scope.currentVid.id + '?autoplay=1';
        })
        .catch(function(error) {
          console.log("error: ", error);
        });
    }
    getVids();

  });
