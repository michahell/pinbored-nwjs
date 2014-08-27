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
      activePage : 3,
      items: [],
      filteredList : [],
      selectedItems : []
    }

    $scope.paging = {
      numPageButtons : 10,
      current : 0,
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

    // functionality
    $scope.createBookmarks = function(pinboardData) {
      
      // console.info(pinboardData);

      var bookmarks = [];
      for(var i=0; i<pinboardData.length; i++) {
        var bmdata = pinboardData[i];
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

      // cache bookmarks in usersession
      Usersessionservice.storeBookmarks(pinboardData);

      // and store in scope
      $scope.data.items = bookmarks;
    }

    $scope.removeBookmarkFrom = function (byProperty, value, collection) {
      var deletedBookmark = $filter('searchcollection')(byProperty, value, collection);
      collection.splice(collection.indexOf(deletedBookmark), 1);
    }

    $scope.clearSelectedItems = function() {
      if($scope.data.selectedItems.length > 0) {
        for(var i=0; i<$scope.data.selectedItems; i++) {
          $scope.data.selectedItems[i].status.selected = false;
        }
      }
      $scope.data.selectedItems = [];
    }

    $scope.deleteSelectedBookmarks = function() {
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
                  $scope.removeBookmarkFrom('hash', deletedBookMarkHash, $scope.data.selectedItems);
                  $scope.removeBookmarkFrom('hash', deletedBookMarkHash, $scope.data.items);
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

    $scope.deleteTags = function() {
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

    $scope.updatePaging = function() {
      $scope.paging.total = $scope.data.items.length;
    }

    $scope.setPage = function (pageNo) {
      $scope.paging.current = pageNo;
    };

    $scope.pageChanged = function() {
      console.log('Page changed to: ' + $scope.paging.current);
    };

    $scope.applyFilters = function() {
      console.log('applying filters to list...');
      var word = $scope.filter.text;
      $scope.data.filteredList = fulltextFilter($scope.data.items, word);
      var tags = $scope.filter.tags;
      var logicType = 'OR';
      $scope.data.filteredList = tagsFilter($scope.data.filteredList, tags, logicType);
    }

    // $scope.searchFilter = function(bookmark) {
    //   var filtered = false;
    //   var word = $scope.filter.text;

    //   if(word.length > 0) {
    //     // var searchFields = [bookmark.extended, bookmark.description, bookmark.href, bookmark.tags];
    //     var searchFields = [bookmark.data.description];
    //     // search all searchFields
    //     for(var i=0; i<searchFields.length; i++) {
    //       var index = searchFields[i].toLowerCase().indexOf(word.toLowerCase());
    //       if (index > -1) {
    //         // set filtered to true and break
    //         filtered = true;
    //         break;
    //       }
    //     }
    //   } else {
    //     filtered = true;
    //   }
    //   return filtered;
    // };

    // $scope.tagsFilter = function(item) {
    //   var filtered = false;
    //   var searchTags = $scope.filter.tags;

    //   if(searchTags.length > 0) {
    //     for(var i=0; i<searchTags.length; i++) {
    //       var searchTag = searchTags[i];
    //       var bookmarkTags = item.data.tags.split(' ');
    //       // console.log(bookmarkTags);
    //       // console.log(searchTag.text);
    //       for(var j=0; j<bookmarkTags.length; j++) {
    //         // console.log(bookmarkTags[j]);
    //         if(bookmarkTags[j] === searchTag.text) {
    //           // console.log('tag found in bookmark!');
    //           filtered = true;
    //           break;
    //         }
    //       }
    //     }
    //   } else {
    //     filtered = true;
    //   }

    //   return filtered;
    // };

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

    $scope.updateFiltersPaging = function() {
      $scope.updatePaging();
      $scope.applyFilters();
    }

    $scope.reload = function() {
      
      // set some stuff
      $scope.data.isLoading = true;
      $scope.data.items = [];
      $scope.filteredList = [];
      $scope.paging.current = 0;
      $scope.paging.total = 0;

      $scope.cancelCurrentOperations();

      // get recent bookmarks
      if ($scope.data.loadType === 'recent') {
        console.log("getting recent bookmarks...");
        Pinboardservice.getRecentBookmarks($scope.config.maxItems)
        .then(function(result) {
            // for some reason, return of recent bookmarks is different
            // from the result of getting all bookmarks back.
            $scope.data.isLoading = false;
            $scope.createBookmarks(result.posts);
            $scope.updateFiltersPaging();
        }, function(reason) {
          console.error('Failed: ' + reason);
        });

      // get all bookmarks
      } else if ($scope.data.loadType === 'all') {
        console.log("TODO: getting ALL bookmarks...");
        Pinboardservice.getAllBookmarks()
        .then(function(result) {
            // for some reason, return of recent bookmarks is different
            // from the result of getting all bookmarks back.
            $scope.data.isLoading = false;
            $scope.createBookmarks(result);
            $scope.updateFiltersPaging();
        }, function(reason) {
          console.error('Failed: ' + reason);
        });
        $scope.data.isLoading = false;
      }
    }

    $scope.repopulateBookmarks = function() {
      if($scope.data.items.length === 0) {
        console.log('checking if stored bookmark set exists...');
        // check if they are cached in service.
        var isEmpty = (Object.keys(Usersessionservice.storedBookmarks).length) === 0 ? true : false;
        console.log("are cached bookmarks empty? " + isEmpty);

        if(!isEmpty) {
          console.log('cached bookmarks exist.');
          if(Usersessionservice.storedBookmarks.length > 0) {
            console.log('retrieving cached bookmarks.');
            $scope.createBookmarks(Usersessionservice.storedBookmarks);
            $scope.data.isLoading = false;
          }
        } else {
          // request recent bookmarks if there are none loaded yet.
          $scope.reload();
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
              $scope.deleteSelectedBookmarks();
              break;
            case "deleteAllTags":
              $scope.deleteTags();
              break;
        }
      }
    }

    $scope.changeLoadType = function() {
      console.log('load type selected: ' + $scope.data.loadType);
    }

    // for debugging reasons
    window.$scope = $scope;

    // update current page
    Usersessionservice.setCurrentPage('overview');

    // repopulate bookmark items.
    $scope.repopulateBookmarks();

    // list effects activate
    // stroll.bind('#list ul', { live: true } );

  });