var redditVideo = angular.module('redditVideo', [])
.factory('Videos', function($http){
  // video service's methods defined here
  // get videos
  function getVids() {
    console.log("factory -> getVids");
    return $http({
      method: 'GET',
      url: '/api/vids'
    })
    .then(function (resp) {
      return resp.data;
    })
    .catch(function(error){
      console.log("error: ", error);
    });
};


  return {
    // return obj with methods
    getVids: getVids
  }
})
.controller('VideoController', function($scope, Videos){
  console.log("in VideoController");
  $scope.videoList;
  function getVids(){
    Videos.getVids()
    .then(function(vids){
      console.log("finished getVids = ");
      console.log(vids);
      $scope.videoList = vids;
    })
    .catch(function(error){
      console.log("error: ", error);
    });
  }
  getVids();

});
