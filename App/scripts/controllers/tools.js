
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:ToolsCtrl
 * @description
 * # ToolsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('ToolsCtrl', function ($scope, $location, Usersessionservice, Appstatusservice) {
    
    // if not authenticated, redirect to login page
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path('/login');
      return;
    }

    // if logged off, redirect to login page as well
    $scope.$on('user:authenticated', function() { // args: event, data
      if(Usersessionservice.authenticated === false) {
        $location.path('/login');
        return;
      }
    });

    $scope.duplicatecheck = {
      isLoading: false,
      bookmarks : [],
      duplicates : {
        name : [],
        href : [],
        extended : []
      }
    }

    $scope.loadCachedBookmarks = function() {
      console.log('checking if stored bookmark set exists...');
      // check if they are cached in service.
      var isEmpty = (Object.keys(Usersessionservice.storedBookmarks).length) === 0 ? true : false;
      console.log("are cached bookmarks empty? " + isEmpty);

      if(isEmpty === false) {
        // console.log('cached bookmarks exist.');
        if(Usersessionservice.storedBookmarks.length > 0) {
          Appstatusservice.updateStatus('retrieving cached bookmarks...');
          $scope.duplicatecheck.isLoading = false;
          $scope.duplicatecheck.bookmarks = Usersessionservice.storedBookmarks;
          Appstatusservice.updateStatus('cached bookmarks retrieved.');
        }
      } else {
        // TODO reload (ALL) bookmarks from (TODO) bookmark singleton service...
        console.log('TODO should load (all) bookmarks from (TODO) bookmark singleton service...');
      }
    }

    $scope.checkDuplicates = function() {

      // check if we 'have' bookmarks:
      if(Object.keys($scope.duplicatecheck.bookmarks).length === 0) {
        $scope.loadCachedBookmarks();
      }

      // walk through all bookmarks, check for several duplicate properties:
      Appstatusservice.updateStatus('checking if loaded bookmark set contains duplicates...');
      
      var doublyIterate = function(list, visitorFunc) {
        // maintain internal list of duplicates
        var duplicates = [];

        // doubly iterate over given list, execute visitor function
        for(var i=0; i<list.length; i++) {
          checkedItem = list[i];
          for(var j=0; j<list.length; j++) {
            if(i !== j) {
              duplicateItem = list[j];
              if(visitorFunc(checkedItem, duplicateItem)) {
                duplicates.push({bookmark:checkedItem, duplicate:duplicateItem});
              }
            }
          }
        }

        // return found duplicates list
        return duplicates;
      };
      
      // check for duplicate urls
      Appstatusservice.updateStatus('checking for duplicate urls...');
      // check name duplicate function
      var checkHrefDuplicates = function(bookmark, otherBookmark) {
        return bookmark.href === otherBookmark.href;
      };
      
      // check for duplicate names
      Appstatusservice.updateStatus('checking for duplicate names...');
      var checkNameDuplicates = function(bookmark, otherBookmark) {
        return bookmark.description === otherBookmark.description;
      };

      // check for duplicate descriptions
      Appstatusservice.updateStatus('checking for duplicate descriptions...');
      var checkDescriptionDuplicates = function(bookmark, otherBookmark) {
        return (bookmark.extended !== '' && otherBookmark.extended !== '' && bookmark.extended !== ' ' && bookmark.extended !== ' ' && bookmark.extended === otherBookmark.extended);
      };

      // make it so. Execute aaaaalll the tests!
      $scope.duplicatecheck.duplicates.href = doublyIterate($scope.duplicatecheck.bookmarks, checkHrefDuplicates);
      $scope.duplicatecheck.duplicates.name = doublyIterate($scope.duplicatecheck.bookmarks, checkNameDuplicates);
      $scope.duplicatecheck.duplicates.extended = doublyIterate($scope.duplicatecheck.bookmarks, checkDescriptionDuplicates);

      console.info($scope.duplicatecheck.duplicates.href);
      console.info($scope.duplicatecheck.duplicates.name);
      console.info($scope.duplicatecheck.duplicates.extended);

    }

    // update current page
    Usersessionservice.setCurrentPage('tools');

  });
