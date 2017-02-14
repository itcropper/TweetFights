angular.module('PostCtrl', []).controller('PostController', function($scope, $http, $routeParams) {

    var $id = $scope.id = $routeParams.id;
    
    $scope.disqusConfig = {};
    
    $http({
        method: "GET",
        url: "./api/"+$id
    }).then(function(d){
        $scope.title = d.data[0].title;
        $scope.img_src = d.data[0].img;
        $scope.snippet = d.data[0].snippet;
        
        $scope.disqusConfig = {
            disqus_shortname: "toomuchrightnow",
            disqus_identifier: $id,
            disqus_url: window.location.href
        };
    });
});