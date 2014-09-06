'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainCtrl', function ($scope, $location, $timeout, $filter,
    Pinboardservice, Usersessionservice, Appstatusservice, Utilservice,
    fulltextFilter, tagsFilter) {
    
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path("/login");
      return;
    }

    // page model
    $scope.data = {
      loadType : 'recent',
      isLoading : true,
      activePage : 3,
      items: [],
      filteredList : [],
      selectedItems : []
    }

    $scope.paging = {
      numPageButtons : 10,
      current : 1,
      total : 0
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
      maxItems : 200,
      itemsPerPage : 25,
      showSearch : false,
      showTags : false,
      showPager : false,
      showSelection : false
    }

    $scope.watchers = {
      selectedItemsWatcher : null
    }




    // UTILITY FUNCTIONS




    $scope.removeItemFromCollection = function (byProperty, value, collection) {
      var deletedBookmark = $filter('searchcollection')(byProperty, value, collection);
      collection.splice(collection.indexOf(deletedBookmark), 1);
    }

    $scope.updateStatus = function (message, progress, total) {
      console.info('$scope.updateStatus: ' + message);
      if(progress === undefined || progress === null || total === undefined || total === null) {
        progress = 0;
        total = 0;
      }
      Appstatusservice.updateCurrentProcess(message, progress, total);
    }




    // BATCH SELECTION ACTIONS




    $scope.multiDeleteBookmarks = function() {
      var deleteConfirmed = confirm("Delete all selected bookmarks ?");
      if(deleteConfirmed) {

        var total = $scope.data.selectedItems.length;
        var deleted = 0;
        console.log('bookmarks to delete: ' + total);

        // RECURSIVE delete single bookmark function.
        var deleteNextBookmark = function() {
          if($scope.data.selectedItems.length > 0 && deleted !== total) {
            Pinboardservice.deleteBookmark($scope.data.selectedItems[0].data.href)
              .then(function(result) {
                if(result.result_code === 'done') {
                  var deletionBmHash = $scope.data.selectedItems[0]['data']['hash'];
                  deleted++;
                  $scope.updateStatus('deleted bookmark, hash: ' + deletionBmHash, deleted, total);
                  // remove from scope list
                  $scope.removeItemFromCollection('hash', deletionBmHash, $scope.data.selectedItems);
                  $scope.removeItemFromCollection('hash', deletionBmHash, $scope.data.items);
                  // recursively delete next bookmark
                  if($scope.data.selectedItems.length > 0 && deleted !== total) {
                    deleteNextBookmark(); 
                  }
                }
              }, function(reason) {
                console.error('Failed: ' + reason);
              });
          } else {
            console.log('done deleting all bookmarks.');
          }
        }

        deleteNextBookmark();

      }
    }

    $scope.multiDeleteTags = function() {
      var deleteConfirmed = confirm("Delete all tags of all selected bookmarks ?");
      if(deleteConfirmed) {
        console.log('deleting all tags of selected bookmarks...');
        
        // mock delete all tagsfunction.
        var mockmultiDeleteTags = function(i) {
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
          mockmultiDeleteTags(i);
        }
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
              $scope.multiDeleteBookmarks();
              break;
            case "deleteAllTags":
              $scope.multiDeleteTags();
              break;
        }
      }
    }




    // BOOKMARK (RE)LOADING




    $scope.reload = function() {
      
      // set some stuff
      $scope.data.isLoading = true;
      $scope.data.items = [];
      $scope.filteredList = [];
      $scope.paging.current = 1;
      $scope.paging.total = 0;

      $scope.cancelCurrentOperations();

      // get recent bookmarks
      if ($scope.data.loadType === 'recent') {
        $scope.updateStatus('getting recent bookmarks...');
        Pinboardservice.getRecentBookmarks($scope.config.maxItems)
        .then(function(result) {
            // for some reason, return of recent bookmarks is different
            // from the result of getting all bookmarks back.
            $scope.data.isLoading = false;
            $scope.createBookmarks(result.posts);
            $scope.updateFiltersPaging();
            $scope.updateStatus('recent bookmarks loaded.');
        }, function(reason) {
          console.error('Failed: ' + reason);
          $scope.updateStatus('recent bookmarks failed to load.');
        });

      // get all bookmarks
      } else if ($scope.data.loadType === 'all') {
        $scope.updateStatus('getting all bookmarks...');
        Pinboardservice.getAllBookmarks()
        .then(function(result) {
            // for some reason, return of recent bookmarks is different
            // from the result of getting all bookmarks back.
            $scope.data.isLoading = false;
            $scope.createBookmarks(result);
            $scope.updateFiltersPaging();
            $scope.updateStatus('all bookmarks loaded.');
        }, function(reason) {
          console.error('Failed: ' + reason);
          $scope.updateStatus('all bookmarks failed to load.');
        });
        $scope.data.isLoading = false;
      }
    }

    $scope.repopulateBookmarks = function() {
      if($scope.data.items.length === 0) {
        // console.log('checking if stored bookmark set exists...');
        // check if they are cached in service.
        var isEmpty = (Object.keys(Usersessionservice.storedBookmarks).length) === 0 ? true : false;
        // console.log("are cached bookmarks empty? " + isEmpty);

        if(!isEmpty) {
          // console.log('cached bookmarks exist.');
          if(Usersessionservice.storedBookmarks.length > 0) {
            $scope.updateStatus('retrieving cached bookmarks...');
            $scope.data.isLoading = false;
            $scope.createBookmarks(Usersessionservice.storedBookmarks);
            $scope.updateFiltersPaging();
            $scope.updateStatus('cached bookmarks retrieved.');
          }
        } else {
          // request recent bookmarks if there are none loaded yet.
          $scope.reload();
        }
      }
    }

    $scope.createBookmarks = function(pinboardData) {
      console.info(pinboardData);
      var bookmarks = [];
      for(var i=0; i<pinboardData.length; i++) {
        var bmdata = pinboardData[i];
        var bookMark = {
          status: {
            selected : false,
            showEdit : false,
            hasChanged : false,
            staleness : 'unknown'
          },
          data: bmdata
        }
        bookmarks.push(bookMark);
      }

      // cache bookmarks in usersession
      Usersessionservice.storeBookmarks(pinboardData);

      // and store in scope
      $scope.data.items = bookmarks;
    }




    // PAGING AND FILTERS




    $scope.updateFiltersPaging = function() {
      $scope.applyFilters();
      $scope.updatePaging();
    }    

    $scope.updatePaging = function() {
      $scope.paging.total = Math.min($scope.data.items.length, $scope.data.filteredList.length);
      console.log('paging total: ' + $scope.paging.total);
    }

    $scope.pageChanged = function() {
      console.log('Page changed to: ' + $scope.paging.current);
    };

    $scope.applyFilters = function() {
      // console.log('applying filters to list...');
      var word = $scope.filter.text;
      var tags = $scope.filter.tags;
      var logicType = 'OR';
      $scope.data.filteredList = fulltextFilter($scope.data.items, word);
      $scope.data.filteredList = tagsFilter($scope.data.filteredList, tags, logicType);
    }




    // EOF PAGING AND FILTERS




    $scope.clearSelectedItems = function() {
      if($scope.data.selectedItems.length > 0) {
        for(var i=0; i<$scope.data.selectedItems; i++) {
          $scope.data.selectedItems[i].status.selected = false;
        }
      }
      $scope.data.selectedItems = [];
    }

    $scope.deleteBookmark = function (bookmarkItem) {
      var responseFailed = function(message) {
        console.info('bookmarkitem deleting failed:');
        console.info(message);
        alert('Failed to delete bookmark.');
      };

      Pinboardservice.deleteBookmark(bookmarkItem.data.href)
        .then(function(result) {
          if(result.result_code === 'done') {
            console.log('delete request completed.');
            $scope.removeItemFromCollection('hash', bookmarkItem.data.hash, $scope.data.items);
            $scope.updateStatus('deleted bookmark, hash: ' + bookmarkItem.data.hash);
          } else {
            responseFailed(result);
          }
        }, function(reason) {
          responseFailed(reason);
        });
    }

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

    $scope.changeLoadType = function() {
      console.log('load type selected: ' + $scope.data.loadType);
    }




    // SETUP AND INITIALISATION




    // for debugging reasons
    window.$scope = $scope;

    // update current page
    Usersessionservice.setCurrentPage('overview');

    // repopulate bookmark items.
    $scope.repopulateBookmarks();

    // setup a watchCollection on the filteredList
    $scope.watchers.selectedItemsWatcher = $scope.$watchCollection('data.selectedItems', function(newList, oldList) {
      console.log('selected items changed!');
      // show multi action bar when selectedItems.length > 2
      if($scope.data.selectedItems.length > 1) {
        $scope.config.showSelection = true;
      } else {
        $scope.config.showSelection = false;
      }
    });

    // list effects activate
    // stroll.bind('#list ul', { live: true } );

  });