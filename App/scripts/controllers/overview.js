
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:OverviewCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('OverviewCtrl', 
    ['$scope', '$controller', '$location', '$filter', '$q', 
    'Bookmarkservice', 'Pinboardservice', 'Usersessionservice', 'Appstatusservice', 
    'Utilservice', 'Modalservice',
    function ($scope, $controller, $location, $filter, $q,
      Bookmarkservice, Pinboardservice, Usersessionservice, Appstatusservice, 
      Utilservice, Modalservice) {
    
    // Initialize the super (controller) class and extend it.
    angular.extend(this, $controller('BaseViewCtrl', {$scope: $scope}));

    // Search functionality
    angular.extend(this, $controller('SearchableViewCtrl', {$scope: $scope}));

    $scope.multiAction = {
      show : false,
      selectedAction : 'select action',
      dangerousAction : false,
      newTagName : '',
      newTagNames : [],
      foldTagName : '',
      foldTagNames : []
    };

    // page model
    angular.extend($scope.data, {
      loadType : 'recent',
      loadTypes : ['recent', 'all'],
      activePage : 3,
      selectedItems : [],
      bgMsg : 'NO BOOKMARKS FOUND.'
    });

    angular.extend($scope.config, {
      showSelection : false
    });




    // BATCH SELECTION ACTIONS




    // this method serves to color the selection action button depending on the 'severity'
    // of the selected action.
    $scope.changeMultiAction = function() {
      // console.log('change multi action called!');
      // console.log('ng model: ' + $scope.multiAction.selectedAction);
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
        console.log('method call: multi' + Utilservice.capitalize($scope.multiAction.selectedAction));
        $scope['multi' + Utilservice.capitalize($scope.multiAction.selectedAction)]();
      }
    };

    $scope.multiDeleteAllItems = function() {
      Modalservice.confirm('', 'Delete selected bookmarks ? <br/>This request can not be cancelled when started!')
      .then(function() {
        // recursively delete all items
        Bookmarkservice.selectionRecursiveDelete($scope.data.selectedItems, $scope.data.items);
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
      Bookmarkservice.selectionStaleCheck($scope.data.selectedItems);
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




    // BOOKMARK (RE)LOADING



    
    $scope.setLoadType = function(newLoadType) {
      if(_.contains($scope.data.loadTypes, newLoadType)) {
        $scope.data.loadType = newLoadType;
      } else {
        console.error('the input loadType is incorrect, must be valid loadType!');
      }
    };

    $scope.forceReload = function() {
      $scope.reload($scope.data.loadType);
    };

    $scope.reload = function(loadType) {
      
      // set some stupid local state
      $scope.data.isLoading = true;
      $scope.data.items = [];
      $scope.data.bgMsg = 'LOADING BOOKMARKS...';
      $scope.filteredList = [];
      $scope.paging.current = 1;
      $scope.paging.total = 0;

      $scope.cancelCurrentOperations();

      Bookmarkservice.loadBookmarks(loadType, $scope.appconfig.maxRecentItems)
      .then(function(result) {
        setTimeout(function() {
          $scope.data.items = Bookmarkservice.createBookmarkObjects(result);
          $scope.updateFiltersPaging();
          Appstatusservice.updateStatus(loadType +' bookmarks loaded.');
          $scope.data.isLoading = false;
          $scope.data.bgMsg = 'BOOKMARKS LOADED.';
        }, 50);
      }, function(reason) {
        console.error('Failed: ' + reason);
        Appstatusservice.updateStatus(loadType +' bookmarks failed to load.');
        $scope.data.bgMsg = 'BOOKMARKS FAILED TO LOAD...';
      });
    };


    $scope.repopulateBookmarks = function() {
      var tempLoadType;

      // temp loadType substitution
      if(Bookmarkservice.hasFilterBuffer()) {
        tempLoadType = 'filtered';
        return $scope.reload(tempLoadType);
      } else {
        tempLoadType = $scope.data.loadType;
      }

      // check if there are cached bookmarks.
      var hasCachedBookmarks = !(Utilservice.objectSize(Bookmarkservice.storedBookmarkData) === 0 ? true : false);

      if(hasCachedBookmarks) {
        if(Bookmarkservice.storedBookmarkData.length > 0) {
          Appstatusservice.updateStatus('retrieving cached bookmarks...');
          $scope.data.items = Bookmarkservice.createBookmarkObjects(Bookmarkservice.storedBookmarkData);
          $scope.updateFiltersPaging();
          Appstatusservice.updateStatus('cached bookmarks retrieved.');
          $scope.data.isLoading = false;
        }
      } else {
        $scope.reload(tempLoadType);
      }
    };

    $scope.reloadTags = function() {
      // get all tags  
      Appstatusservice.updateStatus('retrieving all tags...');
      
      Pinboardservice.getAllTags()
      .then(function(result) {
        // store stripped down version for autocomplete
        for (var tag in result) {
          if (result.hasOwnProperty(tag)) {
            $scope.data.tagNames.push({
              text : tag
            });
          }
        }
        // console.log($scope.data.tagNames);
        Appstatusservice.updateStatus('all tags retrieved.');
      }, function(failreason) {
        console.error('Failed: ' + failreason);
      });
    };




    // PAGING AND FILTERS




    $scope.hotkeySearch = function() {
      $scope.config.showSearch = ($scope.config.showSearch === false) ? true : false;
      // console.log('search called! ', $scope.config.showSearch);
      $scope.$apply();
    };

    $scope.hotkeySearchTag = function() {
      $scope.config.showTags = ($scope.config.showTags === false) ? true : false;
      // console.log('search called! ', $scope.config.showTags);
      $scope.$apply();
    };

    $scope.applyFilterBuffer = function() {
      if(Bookmarkservice.hasFilterBuffer()) {
        // add filter buffer tags
        for(var i=0; i<Bookmarkservice.filterBuffer.tags.length; i++) {
          var filterBufferTag = Bookmarkservice.filterBuffer.tags[i];
          $scope.filter.tags.push(filterBufferTag);
        }
        // set tag uniqueness (only those tags and no others)
        $scope.appconfig.tagFilterType = Bookmarkservice.filterBuffer.tagFilterType;

        // add filter buffer text
        $scope.filter.text = Bookmarkservice.filterBuffer.text;

        // clear the filter buffer
        Bookmarkservice.clearFilterBuffer();

        // and update filters!
        $scope.updateFiltersPaging();
      }
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




    $scope.$on('$viewContentLoaded', function() {
      console.info('overview $viewContentLoaded called');

      $scope.config.collectionType = 'bookmarks';
      
      // repopulate bookmark items.
      $scope.repopulateBookmarks();

      // load all tags
      $scope.reloadTags();

      // and filter them, if there is any filterBuffer
      $scope.applyFilterBuffer();
    });

    $scope.$on('$destroy', function() {
      
    });

    // update current page
    Usersessionservice.setCurrentSection('overview');

  }]);