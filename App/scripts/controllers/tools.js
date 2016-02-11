
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:ToolsCtrl
 * @description
 * # ToolsCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('ToolsCtrl', 
    ['$scope', '$controller', '$location', 'Usersessionservice', 'Appstatusservice', 'Bookmarkservice', 
    function ($scope, $controller, $location, Usersessionservice, Appstatusservice, Bookmarkservice) {
    
    // Initialize the super (controller) class and extend it.
    angular.extend(this, $controller('BaseViewCtrl', {$scope: $scope}));

    $scope.duplicatecheck = {
      isLoading: false,
      bookmarks : [],
      duplicates : {
        name : [],
        href : [],
        extended : []
      }
    };

    $scope.loadCachedBookmarks = function() {
      console.log('checking if stored bookmark set exists...');
      // check if they are cached in service.
      var isEmpty = (Object.keys(Bookmarkservice.storedBookmarkData).length) === 0 ? true : false;
      console.log('are cached bookmarks empty? ' + isEmpty);

      if(isEmpty === false) {
        // console.log('cached bookmarks exist.');
        if(Bookmarkservice.storedBookmarkData.length > 0) {
          Appstatusservice.updateStatus('retrieving cached bookmarks...');
          $scope.duplicatecheck.isLoading = false;
          $scope.duplicatecheck.bookmarks = Bookmarkservice.storedBookmarkData;
          Appstatusservice.updateStatus('cached bookmarks retrieved.');
        }
      }
    };

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
          var checkedItem = list[i];
          for(var j=0; j<list.length; j++) {
            if(i !== j) {
              var duplicateItem = list[j];
              if(visitorFunc(checkedItem, duplicateItem)) {
                duplicates.push({bookmark:checkedItem, duplicate:duplicateItem});
              }
            }
          }
        }

        // return found duplicates list
        return duplicates;
      };
      
      // check for duplicate names
      var checkHrefDuplicates = function(bookmark, otherBookmark) {
        return bookmark.href === otherBookmark.href;
      };
      
      // check for duplicate names
      var checkNameDuplicates = function(bookmark, otherBookmark) {
        return bookmark.description === otherBookmark.description;
      };

      // check for duplicate descriptions
      var checkDescriptionDuplicates = function(bookmark, otherBookmark) {
        return (bookmark.extended !== '' && otherBookmark.extended !== '' && bookmark.extended !== ' ' && bookmark.extended !== ' ' && bookmark.extended === otherBookmark.extended);
      };

      // make it so. Execute aaaaalll the tests!
      // $scope.duplicatecheck.duplicates.href = doublyIterate($scope.duplicatecheck.bookmarks, checkHrefDuplicates);
      // $scope.duplicatecheck.duplicates.name = doublyIterate($scope.duplicatecheck.bookmarks, checkNameDuplicates);
      // $scope.duplicatecheck.duplicates.extended = doublyIterate($scope.duplicatecheck.bookmarks, checkDescriptionDuplicates);

      $scope.duplicatecheck.duplicates.href = Bookmarkservice.createBookmarkObjects(
        doublyIterate($scope.duplicatecheck.bookmarks, checkHrefDuplicates));

      $scope.duplicatecheck.duplicates.name = Bookmarkservice.createBookmarkObjects(
        doublyIterate($scope.duplicatecheck.bookmarks, checkNameDuplicates));

      $scope.duplicatecheck.duplicates.extended = Bookmarkservice.createBookmarkObjects(
        doublyIterate($scope.duplicatecheck.bookmarks, checkDescriptionDuplicates));

      console.info($scope.duplicatecheck.duplicates.href);
      console.info($scope.duplicatecheck.duplicates.name);
      console.info($scope.duplicatecheck.duplicates.extended);

    };

    // update current page
    Usersessionservice.setCurrentSection('tools');

  }]);
