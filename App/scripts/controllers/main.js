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
    // console.log("testing if authenticated..");
    
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path("/login");
      return;
    }

    // page model
    $scope.data = {
      loadType : 'recent',
      pageRange : [],
      items: [],
      selectedItems : [],
      activePage : 0,
      isLoading : true
    }

    $scope.filter = {
      text : '',
      tags : []
    }

    $scope.multiAction = {
      show : false,
      selectedAction : '',
      dangerousAction : false,
      newTagName : ''
    }

    $scope.config = {
      searchAllWords : false,
      searchAllWordsText : 'search all words',
      maxItems : 50,
      showSearch : false,
      showTags : false,
      showPager : false,
      showSelection : false
    }

    // update current page
    Usersessionservice.setCurrentPage('overview');

    // functionality
    function createBookmarks (pinboardData) {
      var bookmarks = [];
      for(var i=0; i<pinboardData.posts.length; i++) {
        var bmdata = pinboardData.posts[i];
        var bm = {
          status: {
            selected : false,
            showEdit : false,
            hasChanged : false
          },
          data: bmdata
        }
        bookmarks.push(bm);
      }
      // console.info(bookmarks);
      return bookmarks;
    }

    $scope.searchFilter = function(item) {
      var filtered = false;
      var word = $scope.filter.text;

      if(word.length > 0) {
        // var searchFields = [item.extended, item.description, item.href, item.tags];
        var searchFields = [item.data.description];
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

    $scope.tagsFilter = function(item) {
      var filtered = false;
      var searchTags = $scope.filter.tags;

      if(searchTags.length > 0) {
        for(var i=0; i<searchTags.length; i++) {
          var searchTag = searchTags[i];
          var bookmarkTags = item.data.tags.split(' ');
          // console.log(bookmarkTags);
          // console.log(searchTag.text);
          for(var j=0; j<bookmarkTags.length; j++) {
            // console.log(bookmarkTags[j]);
            if(bookmarkTags[j] === searchTag.text) {
              // console.log('tag found in bookmark!');
              filtered = true;
              break;
            }
          }
        }
      } else {
        filtered = true;
      }

      return filtered;
    };

    $scope.cancelCurrentOperations = function(exception) {

      $scope.multiAction.selectedAction = '';

      // first, de-highlight and fold all items
      if($scope.data.items.length > 0) {
        for(var i=0; i<$scope.data.items.length; i++) {
          if($scope.data.items[i] !== exception) {
            $scope.data.items[i].status.selected = false;
            $scope.data.items[i].status.showEdit = false;
            // $scope.data.items[i].status.hasChanged = false;
          }
        }
      }

      // then, clear currently selected items
      $scope.data.selectedItems = [];

      // hide multi action bar
      $scope.multiAction.selectedAction = '';
      $scope.changeMultiAction();
    }

    $scope.reload = function() {
      
      // set some stuff
      $scope.data.isLoading = true;
      $scope.data.items = [];
      $scope.filteredList = [];

      $scope.cancelCurrentOperations();

      // get recent bookmarks
      if ($scope.data.loadType === 'recent') {
        console.log("getting recent bookmarks...");
        Pinboardservice.getRecentBookmarks($scope.config.maxItems)
        .then(function(result) {
            $scope.data.isLoading = false;
            $scope.data.items = createBookmarks(result);
        }, function(reason) {
          console.error('Failed: ' + reason);
        });

      // get all bookmarks
      } else if ($scope.data.loadType === 'all') {
        console.log("TODO: getting ALL bookmarks...");
      }
    }

    $scope.changeMultiAction = function() {
      if($scope.multiAction.selectedAction === '') {
        $scope.multiAction.show = false;
      } else {
        $scope.multiAction.show = true;
        switch($scope.multiAction.selectedAction) {
          case "deleteAllItems":
            $scope.multiAction.dangerousAction = true;
            break;
          case "deleteAllTags":
            $scope.multiAction.dangerousAction = true;
            break;
          default:
            $scope.multiAction.dangerousAction = false;
        }
      }
    }

    $scope.executeMultiAction = function() {
      console.log('executing action: ' + $scope.multiAction.selectedAction);
    }

    $scope.changeLoadType = function() {
      console.log('load type selected: ' + $scope.data.loadType);
    }

    // add test pages
    for(var i = 0; i < 20; i++) {
      $scope.data.pageRange.push('page' + i);
    }

    // request recent bookmarks if there are none loaded yet.
    if($scope.data.items.length === 0) {
      // check if they are in
      $scope.reload();
    }

    // list effects activate
    // stroll.bind('#list ul', { live: true } );

  });