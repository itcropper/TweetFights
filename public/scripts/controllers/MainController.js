var app = angular.module('MainCtrl', []).controller('MainController', function($scope) {

      window.fbAsyncInit = function() {
        FB.init({
          appId      : '736468119852819',
          xfbml      : true,
          version    : 'v2.8'
        });
        FB.AppEvents.logPageView();
      };
    

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk')); 
    
    $scope.TitleText = "How well do you know____?";
    
    $scope.$on('playing-game', function(e){
        $scope.TitleText = "Who tweeted it?";
    });
    
    $scope.$on('finished-game', function(e){
        $scope.TitleText = "Finished!";
    })
    
    $scope.facebookclick = function(){
        FB.ui(
          {
            method: 'share',
            href: 'https://developers.facebook.com/docs/',
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