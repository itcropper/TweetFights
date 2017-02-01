angular.module('HomeCtrl', []).controller('HomeController', function($scope, $http, $sce) {

    $scope.moduleState = "query";
    
    let tweetData = {};
    
    $scope.form = {};
    $scope.leader_profile_img = '';
    $scope.score = 0;
    $scope.side = 0;
    let index = 0,
        count = 0,
        maxGuesses = 0;
    
    let scrubText = function(txt){
        return txt.replace(/----blurry----/g, "<span class='blurry' ></span>.")
    }
    
    let renderResponse = function(){
        var percentage = $scope.score / maxGuesses ;
        if(percentage >= .95){
            $scope.scoreComments = "Whoa! You're a serious fan!";
            $scope.scoreResults = "You got " + $scope.score + " out of " + maxGuesses;
        }else if(percentage < .95 && percentage >= .85){
            $scope.scoreComments = "Nice work. You know your stuff.";
            $scope.scoreResults = "You got " + $scope.score + " out of " + maxGuesses;
        }else if (percentage < .85 && percentage >= .75) {
            $scope.scoreComments = "Not bad. I guess that means you have a life.";
            $scope.scoreResults = "You got " + $scope.score + " out of " + maxGuesses;
        }else if (percentage < .75 && percentage >= .50) {
            $scope.scoreComments = "Not so hot.";
            $scope.scoreResults = "You got " + $scope.score + " out of " + maxGuesses;
        }else if (percentage < .75 && percentage >= .50) {
            $scope.scoreComments = "You probably shouldn't tell people that you're friends.";
            $scope.scoreResults = "You only got " + $scope.score + " out of " + maxGuesses;
        }else {
            $scope.scoreComments = "You just put in a random username, didn't you?";
            $scope.scoreResults = "You got " + $scope.score + " out of " + maxGuesses;
        }
    }
    
    $scope.keypress = function($event){
        if ($event.which === 13)
            $scope.submit();
    };

    $scope.submit = function(){
        $http({
            url: "./api/"+$scope.form.username.replace("@", ""),
            method: "GET"            
        }).then(function(response){
            tweetData = response.data;
            $scope.moduleState = "compare";   
            $scope.$emit('playing-game');
            $scope.leader_profile_img = tweetData.original.image;
            $scope.name = tweetData.original.name;
            maxGuesses = Math.min(tweetData.original.tweets.length, tweetData.fakes.length, 10);
            tweetData.original.tweets.shuffle();
            tweetData.fakes.shuffle();
            var rand = Math.random();
            let text1 = '',
                text2 = '';
            if(rand >= .5){
                text1 = scrubText(tweetData.original.tweets[index].text + "<p class='hidden' data-answer='correct'></p>");
                text2 = scrubText(tweetData.fakes[index].text + "<p class='hidden' data-answer='wrong'></p>");
            }else {
                text2 = scrubText(tweetData.original.tweets[index].text + "<p class='hidden' data-answer='correct'></p>");
                text1 = scrubText(tweetData.fakes[index].text + "<p class='hidden' data-answer='wrong'></p>");
            }
            
            $scope.text1 = $sce.trustAsHtml(text1);
            $scope.text2 = $sce.trustAsHtml(text2);
        },
        function(err){
            $scope.label = "Doesn't look like that's a valid twitter handle. Try again."
        });
    };
    
    $scope.guess = function($event){
        
        if(index >= maxGuesses) {
            $scope.moduleState = "finished";
            $scope.$emit('finished-game');
            renderResponse();
            return;
        }
        
        function next() {
            index++;
            let text1 = '',
                text2 = '';

            if(Math.random() >= .5){
                text1 = scrubText(tweetData.original.tweets[index].text + "<p class='hidden' data-answer='correct'></p>");
                text2 = scrubText(tweetData.fakes[index].text + "<p class='hidden' data-answer='wrong'></p>");
            }else{
                text2 = scrubText(tweetData.original.tweets[index].text + "<p class='hidden' data-answer='correct'></p>");
                text1 = scrubText(tweetData.fakes[index].text + "<p class='hidden' data-answer='wrong'></p>");
            }
            $scope.text1 = $sce.trustAsHtml(text1);
            $scope.text2 = $sce.trustAsHtml(text2);
        }
        
        //console.log($event.target.innerHTML);
        
        if($event.target.innerHTML.indexOf('data-answer="correct"') > -1){
            $scope.score+=1;
            next();
        }
        else{
//            var el = angular.element($event.currentTarget);
//            el.addClass('wrong');
//            setTimeout(function(e){
//                next();
//            }, 1000);
            next();
        }
    }
    
    function next(){
        
    }

});