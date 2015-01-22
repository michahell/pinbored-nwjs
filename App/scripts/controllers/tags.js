
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('TagsCtrl', function ($scope, Pinboardservice, Appstatusservice, 
    Usersessionservice, $location) {
    
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
    $scope.paging = {
      numPageButtons : 10,
      current : 1,
      total : 0
    };

    $scope.data = {
      isLoading : true,
      tags : [],
      wrappedTags : [],
      numTags : 0
    };

    $scope.config = {
      showPager : false,
      itemsPerPage : 39       // 13 rows * 3 cols
    };

    $scope.gridsterOpts = {
      columns: 6, // the width of the grid, in columns
      pushing: true, // whether to push other items out of the way on move or resize
      floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
      swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
      width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
      colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 75, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      margins: [4, 4], // the pixel distance between each widget
      outerMargin: true, // whether margins apply to outer edges of the grid
      isMobile: false, // stacks the grid items if true
      // mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
      mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
      minColumns: 6, // the minimum columns the grid must have
      minRows: 2, // the minimum height of the grid, in rows
      maxRows: 100,
      // defaultSizeX: 2, // the default width of a gridster item, if not specifed
      // defaultSizeY: 1, // the default height of a gridster item, if not specified
      minSizeX: 2, // minimum column width of an item
      maxSizeX: 3, // maximum column width of an item
      minSizeY: 1, // minumum row height of an item
      maxSizeY: 5, // maximum row height of an item
      resizable: {
       enabled: false,
       handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
       start: function(event, $element, widget) {}, // optional callback fired when resize is started,
       resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
       stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
      },
      draggable: {
       enabled: false, // whether dragging items is supported
       handle: '.my-class', // optional selector for resize handle
       start: function(event, $element, widget) {}, // optional callback fired when drag is started,
       drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
       stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
      }
    };

    $scope.createTags = function(tagdata) {

      // console.log(tagdata);

      for (var tag in tagdata) {
        // console.log(tag, tagdata[tag]);
        $scope.data.tags.push({
          tagname : tag,
          occurrences : parseInt(tagdata[tag])
        });

        // wrapped tags (for angular-gridster)
        $scope.data.wrappedTags.push({
          tagname : tag,
          occurrences : parseInt(tagdata[tag]),
          sizeX: 2,
          sizeY: 1
        });
      }
      
      // console.log($scope.data.tags);
      console.log($scope.data.wrappedTags);
      
      $scope.data.numTags = $scope.data.tags.length;
      $scope.paging.total = $scope.data.tags.length;

      if($scope.data.numTags > 0) {
        console.log($scope.data.numTags + ' tags retrieved.');
        return true;
      } else {
        console.warn('no tags received, so no tags created.');
        return false;
      }
    }

    $scope.repopulateTags = function() {
      // get all tags  
      Appstatusservice.updateStatus('retrieving all tags...');
      
      Pinboardservice.getAllTags()
      .then(function(result) {
        if($scope.createTags(result)) {
          $scope.data.isLoading = false;
          // 'insta' show paging bar
          $scope.config.showPager = true;
          Appstatusservice.updateStatus('all tags retrieved.');
        }
      }, function(failreason) {
        console.error('Failed: ' + failreason);
      });
    }

    $scope.removeTag = function(tag) {
      $scope.data.tags.splice($scope.data.tags.indexOf(tag), 1);
      $scope.data.wrappedTags.splice($scope.data.wrappedTags.indexOf(tag), 1);
    }





    // SETUP AND INITIALISATION


    

    // update current page
    Usersessionservice.setCurrentSection('tags');

    // repopulate bookmark items.
    $scope.repopulateTags();

    // for debugging reasons
    window.$scope = $scope;

  });
