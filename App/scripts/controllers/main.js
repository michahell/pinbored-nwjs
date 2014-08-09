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
      maxItems : 25
    }

    // visibility switches (literally)
    $scope.showPager = false;
    $scope.showTags = false;

    $scope.searchFilter = function(item) {
      var filter = false;
      if($scope.filter.text.length > 0) {
        var searchFields = [item.extended, item.description, item.href, item.tags];
        // search all searchFields
        for(var i=0; i<searchFields.length; i++) {
          if (searchFields[i].toLowerCase().indexOf($scope.filter.text.toLowerCase()) > -1) {
            filter = true;
            break;
          }
        }
      } else {
        filter = true;
      }
      return filter;
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

    // request some bookmarks
    console.log("testing getRecentBookmarks...");
    Pinboardservice.getRecentBookmarks(50)
    .then(function(result) {
        $scope.data.items = createBookmarks(result);
    }, function(reason) {
      console.info('Failed: ' + reason);
    });

    // list effects activate
    // stroll.bind('#list ul', { live: true } );

  });