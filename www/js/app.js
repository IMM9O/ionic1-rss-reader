
(function (){



var app = angular.module('starter', ['ionic','angularMoment','ngCordova']);




app.controller('readlist',function($http ,$q,$cordovaInAppBrowser,$cordovaSocialSharing){
    this.shouldShowDelete = false;
    this.shouldShowReorder = false;
    this.listCanSwipe = true;

    this.stories = [];

     // check if the url imag has image or not
     function isImage(src) {

        var deferred = $q.defer();

        var image = new Image();
        image.onerror = function() {
            deferred.resolve(false);
        };
        image.onload = function() {
            deferred.resolve(true);
        };
        image.src = src;

        return deferred.promise;
    }

    this.openBrowser = function (url){
      console.log(url);
      $cordovaInAppBrowser.open(url, '_blank', {})
          .then(function(event) {
             // success
          })
          .catch(function(event) {
             // error
          });

      // $cordovaInAppBrowser.close();
    }


    function loadStories (prams,callback){
      $http.get('https://www.reddit.com/r/FlashTV/new/.json', {prams: prams}).success(function(rescponselist) {
              var stories =[];
              angular.forEach(rescponselist.data.children,function(child){
                  isImage(child.data.thumbnail).then(function(test) {
                       if(!test) child.data.thumbnail = 'img/redit.png';
                  });
                  stories.push(child.data);
              });
              callback(stories);
              
        });
    }

    //// load more function
    this.loadMore = function() {
         var prams ={};
         if(this.stories.length > 0) {
           prams['after'] = this.stories[this.stories.length -1].name;
         }
            
        loadStories(prams,function(oldStories){
          this.stories = this.stories.concat(oldStories); ;
         
        }); 
         this.$broadcast('scroll.infiniteScrollComplete');
    };

    this.loadNew = function(){
        var prams ={};
            prams['before'] = this.stories[0].name;

        loadStories(prams,function(newStories){
          this.stories = newStories.concat(this.stories) ;
          this.$broadcast('scroll.refreshComplete');

          
        }); 
    };


});



app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


}());