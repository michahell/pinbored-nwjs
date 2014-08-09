'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainCtrl', function ($scope, Pinboardservice, Usersessionservice, Utilservice, $location) {
    
    // check if user is authenticated
    console.log("testing if authenticated..");
    if (Usersessionservice.isAuthenticated() === false) {
      console.log("testing if authenticated..");
      $location.path("/login");
      return;
    }

    // page model
    $scope.data = {
      pagerange : [],
      activepage : 2,
      items: []
    }

    $scope.filter = {
      text : '',
      tags : [],
      date : null
    }

    $scope.config = {
      maxItems : 20,
      showSearch : false,
      showTags : false,
      showPager : false
    }

    $scope.searchFilter = function(item) {
      var filtered = false;
      var word = $scope.filter.text;

      if(word.length > 0) {
        // var searchFields = [item.extended, item.description, item.href, item.tags];
        var searchFields = [item.description];
        // search all searchFields
        for(var i=0; i<searchFields.length; i++) {
          var index = searchFields[i].toLowerCase().indexOf(word.toLowerCase());
          if (index > -1) {
            // set filtered to true and break
            filtered = true;
            break;
          }
        }
      } else {
        filtered = true;
      }
      return filtered;
    };

    $scope.tagsFilter = function(bookmarkItem) {
        return true;
    };

    // functionality
    function createBookmarks (pinboardData) {
      var bookmarks = [];
      for(var i=0; i<pinboardData.posts.length; i++) {
        var bm = pinboardData.posts[i];
        bookmarks.push(bm);
      }
      // console.info(bookmarks);
      return bookmarks;
    }

    // add test pages
    for(var i = 0; i < 20; i++) {
      $scope.data.pagerange.push('page' + i);
    }

    // request recent bookmarks if there are none loaded yet.
    if($scope.data.items.length === 0) {
      // check if they are in
      console.log("getting getRecentBookmarks...");
      Pinboardservice.getRecentBookmarks(50)
      .then(function(result) {
          $scope.data.items = createBookmarks(result);
      }, function(reason) {
        console.info('Failed: ' + reason);
      });
    }

    // list effects activate
    // stroll.bind('#list ul', { live: true } );

  });