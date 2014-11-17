
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:OverviewCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('OverviewCtrl', function ($scope, $location, $filter, $modal, $q, $splash, $timeout,
    Bookmarkservice, Pinboardservice, Usersessionservice, Appstatusservice, Utilservice, Modalservice,
    fulltextFilter, tagsFilter) {
    
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

    // page model
    $scope.data = {
      loadType : 'recent',
      isLoading : true,
      activePage : 3,
      items: [],
      filteredList : [],
      selectedItems : []
    };

    $scope.paging = {
      numPageButtons : 10,
      current : 1,
      total : 0
    };

    $scope.filter = {
      textFilterDelay : 750,
      textFilterTimeout : null,
      text : '',
      tags : []
    };

    $scope.multiAction = {
      show : false,
      selectedAction : '',
      dangerousAction : false,
      newTagName : '',
      foldTagName : ''
    };

    $scope.config = {
      tagFilterType : false,
      tagFilterTypeText : 'inclusive / and',
      searchAllWords : false,
      searchAllWordsText : 'search all words',
      maxItems : 200,
      maxTagSearch : 4,
      itemsPerPage : 25,
      showSearch : false,
      showTags : false,
      showPager : false,
      showSelection : false
    };




    // BATCH SELECTION ACTIONS




    $scope.multiDeleteAllItems = function() {
      Modalservice.confirm('', 'Delete selected bookmarks ? <br/>This request can not be cancelled when started!')
      .then(function() {

        var total = $scope.data.selectedItems.length;
        var deleted = 0;
        console.log('bookmarks to delete: ' + total);

        // RECURSIVE delete single bookmark function.
        var deleteNextBookmark = function() {
          if($scope.data.selectedItems.length > 0 && deleted !== total) {
            Pinboardservice.deleteBookmark($scope.data.selectedItems[0].data.href)
              .then(function(result) {
                if(result.result_code === 'done') {
                  // var deletionBmHash = $scope.data.selectedItems[0]['data']['hash'];
                  var deletionBmHash = $scope.data.selectedItems[0].data.hash;
                  deleted++;
                  Appstatusservice.updateStatus('deleted bookmark, hash: ' + deletionBmHash + '.', deleted, total);
                  // remove from scope list
                  Utilservice.removeItemFromCollection('hash', deletionBmHash, $scope.data.selectedItems);
                  Utilservice.removeItemFromCollection('hash', deletionBmHash, $scope.data.items);
                  // recursively delete next bookmark
                  if($scope.data.selectedItems.length > 0 && deleted !== total) {
                    deleteNextBookmark();
                  }
                }
              }, function(reason) {
                Appstatusservice.updateStatus('Failed: ' + reason, deleted, total, 'danger');
              });
          } else {
            Appstatusservice.updateStatus('done deleting all selected bookmarks.');
          }
        };

        // delete the first bookmark and start recursion
        deleteNextBookmark();

      }, function(){
        console.log('modal cancelled.');
      });
    };

    $scope.multiDeleteAllTags = function() {
      Modalservice.confirm('', 'Delete all tags on selected bookmarks ? \nThis request can not be cancelled when started!')
      .then(function(){
        // code moved into function so other batch functions may use it
        Bookmarkservice.selectionDeleteAllTags($scope.data.selectedItems);
      }, function(){
        console.log('modal cancelled.');
      });
    };

    $scope.multiStaleCheck = function() {
      var total = $scope.data.selectedItems.length;
      var checked = 0;
      console.log('bookmarks to stale check: ' + total);

      if($scope.data.selectedItems.length > 0) {
        for(var i=0; i<$scope.data.selectedItems.length; i++) {
          // following is inside anonymous function closure because of loop iterator scope problem
          (function(i){
            // set initial status to checking
            $scope.data.selectedItems[i].status.staleness = 'checking';
            // perform the check url request
            Pinboardservice.checkUrl($scope.data.selectedItems[i].data.href)
            .then(function(result) {
              var checkedBmHash = $scope.data.selectedItems[i].data.hash;
              checked++;
              if(result === 200) {
                Appstatusservice.updateStatus('checked bookmark is healthy: ' + checkedBmHash + '.', checked, total);
                $scope.data.selectedItems[i].status.staleness = 'healthy';
              } else {
                Appstatusservice.updateStatus('checked bookmark is stale: ' + checkedBmHash + '.', checked, total);
                $scope.data.selectedItems[i].status.staleness = 'dead';
              }
              if(checked === total) {
                Appstatusservice.updateStatus('done stale checking all selected bookmarks.');
              }
            }, function(reason) {
              Appstatusservice.updateStatus('Failed: ' + reason, checked, total, 'danger');
              $scope.data.selectedItems[i].status.staleness = 'unknown';
            });
          })(i);
        }
      }

    };

    $scope.multiFoldIntoTag = function() {
      // first check for tag input
      if(!Utilservice.isEmpty($scope.multiAction.foldTagName)) {
        Modalservice.confirm('', 'Fold existing tags into <br/><span class="modal-tag-highlight">' + $scope.multiAction.foldTagName + '</span> ? <br/>This request can not be cancelled when started!')
        .then(function() {
          // first batch delete all tags from selected bookmarks
          Bookmarkservice.selectionDeleteAllTags($scope.data.selectedItems);
          // then add a new tag
          Bookmarkservice.selectionAddTag($scope.multiAction.newTagName, $scope.data.selectedItems);
        }, function() {
          console.log('modal cancelled.');  
        });
      } else {
        Modalservice.alert('', 'no new tag name was given!');
      }
    };

    $scope.multiAddTag = function() {
      // first check for tag input
      if(!Utilservice.isEmpty($scope.multiAction.newTagName)) {

        Modalservice.confirm('', 'Add tag <br/><span class="modal-tag-highlight">' + $scope.multiAction.newTagName + '</span><br/> to selected bookmarks ? <br/>This request can not be cancelled when started!')
        .then(function() {
          // code moved into function so other batch functions may use it
          Bookmarkservice.selectionAddTag($scope.multiAction.newTagName, $scope.data.selectedItems);
        }, function() {
          console.log('modal cancelled.');
        });
      } else {
        Modalservice.alert('', 'no new tag name was given!');
      }
    };

    // this method serves to color the selection action button depending on the 'severity'
    // of the selected action.

    $scope.changeMultiAction = function() {
      if($scope.multiAction.selectedAction === '') {
        $scope.multiAction.show = false;
      } else {
        $scope.multiAction.show = true;
        switch($scope.multiAction.selectedAction) {
        case 'deleteAllItems':
        case 'deleteAllTags':
          $scope.multiAction.dangerousAction = true;
          break;
        default:
          $scope.multiAction.dangerousAction = false;
        }
      }
    };

    $scope.executeMultiAction = function() {
      console.log('executing action: ' + $scope.multiAction.selectedAction);
      if(!Utilservice.isEmpty($scope.multiAction.selectedAction)) {
        // execute the selected multi action method:
        console.log('method call: ' + 'multi' + Utilservice.capitalize($scope.multiAction.selectedAction));
        $scope['multi' + Utilservice.capitalize($scope.multiAction.selectedAction)]();
      }
    };




    // BOOKMARK (RE)LOADING




    $scope.reload = function() {
      
      // set some stupid local state
      $scope.data.isLoading = true;
      $scope.data.items = [];
      $scope.filteredList = [];
      $scope.paging.current = 1;
      $scope.paging.total = 0;

      $scope.cancelCurrentOperations();

      Bookmarkservice.loadBookmarks($scope.data.loadType, $scope.config.maxItems).then(function(result) {
          $scope.data.isLoading = false;
          $scope.data.items = Bookmarkservice.createBookmarkObjects(result);
          $scope.updateFiltersPaging();
          Appstatusservice.updateStatus($scope.data.loadType +' bookmarks loaded.');
        }, function(reason) {
          console.error('Failed: ' + reason);
          Appstatusservice.updateStatus($scope.data.loadType +' bookmarks failed to load.');
        });

    };


    $scope.repopulateBookmarks = function() {
      if($scope.data.items.length === 0) {
        // check if they are cached in service.
        var isEmpty = (Object.keys(Bookmarkservice.storedBookmarkData).length) === 0 ? true : false;

        if(!isEmpty) {
          if(Bookmarkservice.storedBookmarkData.length > 0) {
            Appstatusservice.updateStatus('retrieving cached bookmarks...');
            $scope.data.isLoading = false;
            $scope.data.items = Bookmarkservice.createBookmarkObjects(Bookmarkservice.storedBookmarkData);
            $scope.updateFiltersPaging();
            Appstatusservice.updateStatus('cached bookmarks retrieved.');
          }
        } else {
          $scope.reload();
        }
      }
    };




    // PAGING AND FILTERS




    $scope.checkMaxTags = function() {
      if($scope.filter.tags.length > $scope.config.maxTagSearch) {
        // remove tag, one too many
        $scope.filter.tags.splice($scope.filter.tags.indexOf($scope.filter.tags[$scope.filter.tags.length-1]), 1);
      }
    };

    $scope.onTagAdded = function (tag) {
      $scope.checkMaxTags(tag);
      $scope.updateFiltersPaging();
    };

    $scope.onTagRemoved = function () {
      $scope.updateFiltersPaging();
    };

    // this method is essentially a manual debounce for filtering.
    // debounce was apparently added in Angular 1.3 but why change
    // a winning team? naively thinking, most likely, Angular itself 
    // will use a similar approach anyway.

    $scope.updateFiltersPaging = function() {
      // if the textFilterPromise exists, cancel it:
      if($scope.filter.textFilterTimeout !== null) {
        $timeout.cancel($scope.filter.textFilterTimeout);
      }
      // create new $timeout promise to apply filters and update the paging
      $scope.filter.textFilterTimeout = $timeout(function() {
        $scope.applyFilters();
        $scope.updatePaging();
      }, $scope.filter.textFilterDelay);
    };

    $scope.updatePaging = function() {
      $scope.paging.total = Math.min($scope.data.items.length, $scope.data.filteredList.length);
      console.log('paging total: ' + $scope.paging.total);
    };

    $scope.applyFilters = function() {
      // console.log('applying filters to list...');
      var word = $scope.filter.text;
      var tags = $scope.filter.tags;
      var logicType = ($scope.config.tagFilterType === true) ? 'AND' : 'OR';
      $scope.data.filteredList = fulltextFilter($scope.data.items, word);
      $scope.data.filteredList = tagsFilter($scope.data.filteredList, tags, logicType);
    };

    $scope.clearSelectedItems = function() {
      if($scope.data.selectedItems.length > 0) {
        for(var i=0; i<$scope.data.selectedItems; i++) {
          $scope.data.selectedItems[i].status.selected = false;
        }
      }
      $scope.data.selectedItems = [];
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
    };




    // SETUP AND INITIALISATION


    

    // update current page
    Usersessionservice.setCurrentPage('overview');

    // repopulate bookmark items.
    $scope.repopulateBookmarks();

    // for debugging reasons
    window.$scope = $scope;

    // list effects activate
    // stroll.bind('#list .list-wrapper ul.list-group', { live: true } );

  });