'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainCtrl', function ($scope, Pinboardservice, Usersessionservice, Appstatusservice, Utilservice, $location, $timeout, $filter) {
    
    // check if user is authenticated
    // console.log("testing if authenticated..");
    
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path("/login");
      return;
    }

    // page model
    $scope.data = {
      loadType : 'recent',
      isLoading : true,
      pageRange : [],
      activePage : 3,
      items: [],
      selectedItems : []
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

    // for debugging reasons
    window.MY_SCOPE = $scope;

    // update current page
    Usersessionservice.setCurrentPage('overview');

    // functionality
    function createBookmarks (pinboardData) {
      var bookmarks = [];
      for(var i=0; i<pinboardData.posts.length; i++) {
        var bmdata = pinboardData.posts[i];
        var bookMark = {
          status: {
            selected : false,
            showEdit : false,
            hasChanged : false
          },
          data: bmdata
        }
        bookmarks.push(bookMark);
      }
      return bookmarks;
    }

    function removeBookmarkFrom(byProperty, value, collection) {
      var deletedBookmark = $filter('searchcollection')(byProperty, value, collection);
      collection.splice(collection.indexOf(deletedBookmark), 1);
    }

    function clearSelectedItems() {
      if($scope.data.selectedItems.length > 0) {
        for(var i=0; i<$scope.data.selectedItems; i++) {
          $scope.data.selectedItems[i].status.selected = false;
        }
      }
      $scope.data.selectedItems = [];
    }

    function deleteSelectedBookmarks () {
      var deleteConfirmed = confirm("Delete all selected bookmarks ?");
      if(deleteConfirmed) {

        var total = $scope.data.selectedItems.length;
        var deleted = 0;
        console.log('bookmarks to delete: ' + total);

        // mock delete all function.
        var deleteNextBookmark = function() {
          if($scope.data.selectedItems.length > 0 && deleted !== total) {
            $timeout(function() {
              Pinboardservice.deleteBookmark($scope.data.selectedItems[0])
              .then(function(deletedBookMarkHash) {
                  console.info('Deleted bookmark, hash: ' + deletedBookMarkHash);
                  // increment deleted
                  deleted++;
                  // update app status
                  Appstatusservice.updateCurrentProcess('deleted bookmark', deleted, total);
                  // remove from scope list
                  var deletionBmHash = $scope.data.selectedItems[0]['data']['hash'];
                  removeBookmarkFrom('hash', deletedBookMarkHash, $scope.data.selectedItems);
                  removeBookmarkFrom('hash', deletedBookMarkHash, $scope.data.items);
                  // recursively delete next bookmark
                  if($scope.data.selectedItems.length > 0 && deleted !== total) {
                    deleteNextBookmark(); 
                  }
                }, function(reason) {
                  console.error('Failed: ' + reason);
                });
            }, 200 + Math.random() * 300);
          } else {
            console.log('done deleting all bookmarks.');
          }
        }

        deleteNextBookmark();
      }
    }

    function deleteTags () {
      var deleteConfirmed = confirm("Delete all tags of all selected bookmarks ?");
      if(deleteConfirmed) {
        console.log('deleting all tags of selected bookmarks...');
        
        // mock delete all tagsfunction.
        var mockDeleteTags = function(i) {
          // remove all tags from bookmark
          $scope.data.selectedItems[i].data.tags = '';
          $timeout(function() {
            Pinboardservice.updateBookmark($scope.data.selectedItems[i])
            .then(function(result) {
                console.info('updated bookmark: ' + result);
              }, function(reason) {
                console.error('Failed: ' + reason);
              });
          }, 500 + Math.random() * 800);
        };

        // for each selected bookmark, delete it.
        for(var i=0; i<$scope.data.selectedItems.length; i++) {
          mockDeleteTags(i);
        }
      }
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
      $scope.multiAction.show = false;
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
        $scope.data.isLoading = false;
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
      if($scope.multiAction.selectedAction !== '') {
        switch($scope.multiAction.selectedAction) {
          case "deleteAllItems":
              deleteSelectedBookmarks();
              break;
            case "deleteAllTags":
              deleteTags();
              break;
        }
      }
    }

    $scope.changeLoadType = function() {
      console.log('load type selected: ' + $scope.data.loadType);
    }

    // add test pages
    for(var i = 0; i < 20; i++) {
      $scope.data.pageRange.push('page' + i);
    }

    // repopulate bookmark items.
    if($scope.data.items.length === 0) {
      // check if they are in local storage or something.
      
      
      // request recent bookmarks if there are none loaded yet.
      $scope.reload();
    }

    // list effects activate
    // stroll.bind('#list ul', { live: true } );

  });