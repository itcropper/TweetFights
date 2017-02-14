angular.module('HomeCtrl', []).controller('HomeController', function($scope, $http, $location) {

    $http({
        method: "GET",
        url: "api"
    }).then(function(d){
        $scope.posts = d.data;
    });
    
    $scope.drillDown = function(id){
        $location.path('/post/' + id)
    }
    
    $scope.facebookclick = function(id){
        console.log(location.href + "post/" + id);
        FB.ui(
          {
            method: 'share',
            href: location.href + "post/" + id,
          },
          // callback
          function(response) {
            if (response && !response.error_message) {
              alert('Posting completed.');
            } else {
              alert('Error while posting.');
            }
          }
        );
        
    }
});