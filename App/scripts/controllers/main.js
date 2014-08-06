'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainCtrl', function ($scope, Pinboardservice, Usersessionservice, $location) {
    
    // page model
    $scope.data = {
      pagerange : [],
      activepage : 5,
      items: []
    }

    // functionality
    function createBookmarks (pinboardData) {
      var bookmarks = [];
      for(var i=0; i<pinboardData.posts.length; i++) {
        // var bm = new BookmarkItem(pinboardData.posts[i]);
        var bm = pinboardData.posts[i];
        bookmarks.push(bm);
      }
      console.info(bookmarks);
      return bookmarks;
    }

    // check if user is logged in on Pinboard
    if (Usersessionservice.isAuthenticated == false) {
      $location.path("/login");
    }

    // Init with some cities
    // $scope.cities = [
    //   { "value": 1 , "text": "Amsterdam"   , "continent": "Europe"    },
    //   { "value": 4 , "text": "Washington"  , "continent": "America"   },
    //   { "value": 7 , "text": "Sydney"      , "continent": "Australia" },
    //   { "value": 10, "text": "Beijing"     , "continent": "Asia"      },
    //   { "value": 13, "text": "Cairo"       , "continent": "Africa"    }
    // ];

    // $scope.getTagClass = function(city) {
    //   switch (city.continent) {
    //     case 'Europe'   : return 'badge badge-info';
    //     case 'America'  : return 'label label-important';
    //     case 'Australia': return 'badge badge-success';
    //     case 'Africa'   : return 'label label-inverse';
    //     case 'Asia'     : return 'badge badge-warning';
    //   }
    // };

    // $scope.tags = ['foo', 'bar'];

    // add test pages
    for(var i = 0; i < 20; i++) {
      $scope.data.pagerange.push('page' + i);
    }

    // request some bookmarks
    console.log("testing getRecentBookmarks...");
    Pinboardservice.getRecentBookmarks(25)
    .then(function(result) {
        $scope.data.items = createBookmarks(result);
    }, function(reason) {
      console.info('Failed: ' + reason);
    });

    // list effects activate
    stroll.bind('#list ul', { live: true } );

  });