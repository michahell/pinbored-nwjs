'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:BookmarkItemCtrl
 * @description
 * # BookmarkItemCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('BookmarkItemCtrl', function ($scope, Usersessionservice, Pinboardservice) {

    var gui = require('nw.gui');

    // current item!
    // $scope.item

    // copy of current item
    $scope.itemcopy = null;
    // current item watcher
    $scope.itemWatcher = null;
    $scope.proxyWatcher = null;

    $scope.itemproxy = {
      toread : false,
      shared : false
    }

    $scope.update = function() {
      console.log('item update clicked');
    }















    $scope.reset = function() {
      console.log('item reset clicked');
      $scope.resetBookmark();
    }

    $scope.resetBookmark = function () {
      if($scope.item.status.hasChanged) {
        // create shortcut vars for the data of both items
        var backupdata = $scope.itemcopy.data;
        var currentdata = $scope.item.data;
        // check which data properties have changed and reset these
        for (var prop in currentdata) {
          if (currentdata.hasOwnProperty(prop)) {
            if(currentdata[prop] !== backupdata[prop]) {
              // this property is changed so reset it to the item copy data
              currentdata[prop] = backupdata[prop];
            }
          }
        }
        console.log('reset to previous item state.');
        $scope.item.status.hasChanged = false;
      } else {
        console.log('nothing reset since bookmark was unchanged.');
      }
    }

    $scope.mapToProxyValues = function () {
      // map to proxy shared from 'no' to false and from 'yes' to true
      if($scope.item.data.shared === 'no') {
        $scope.itemproxy.shared = false;
      } else if($scope.item.data.shared === 'yes') {
        $scope.itemproxy.shared = true;
      }
      // map proxy toread from false to 'no' and true to 'yes'
      if($scope.item.data.toread === 'no') {
        $scope.itemproxy.toread = false;
      } else if($scope.item.data.toread === 'yes') {
        $scope.itemproxy.toread = true;
      }
    }

    $scope.closeEditing = function() {
      // remove watcher FIRST
      $scope.removeWatcher();
      // then, reset bookmark
      $scope.resetBookmark();
    }

    $scope.openEditing = function() {
      // deep copy the current item
      $scope.itemcopy = angular.copy($scope.item);
      // map toread and shared to proxy values
      $scope.mapToProxyValues();
      // start watching the current item
      $scope.addWatcher();
    }

    $scope.currentItemChanged = function() {
      console.log('item change detected!');
      $scope.item.status.hasChanged = !angular.equals($scope.item.data, $scope.itemcopy.data);
      // console.log('item DATA has changed compared to item copy DATA: ');
      // console.log($scope.item.status.hasChanged);
    }

    $scope.proxyChanged = function () {
      // map proxy shared from false to 'no' and true to 'yes'
      if($scope.itemproxy.shared === false) {
        $scope.item.data.shared = 'no';
      } else if($scope.itemproxy.shared === true) {
        $scope.item.data.shared = 'yes';
      }
      // map proxy toread from false to 'no' and true to 'yes'
      if($scope.itemproxy.toread === false) {
        $scope.item.data.toread = 'no';
      } else if($scope.itemproxy.toread === true) {
        $scope.item.data.toread = 'yes';
      }
    }

    $scope.removeWatcher = function() {
      // remove watcher if it exists
      if($scope.itemWatcher !== null) $scope.itemWatcher();
      if($scope.proxyWatcher !== null) $scope.proxyWatcher();
    }

    $scope.addWatcher = function() {
      $scope.itemWatcher = $scope.$watchCollection('item.data', function(newItem, oldItem) {
        $scope.currentItemChanged();
      });
      $scope.proxyWatcher = $scope.$watchCollection('itemproxy', function(newItem, oldItem) {
        $scope.proxyChanged();
      });
      console.log('set up watcher for current item...');
    }

    $scope.toggleEdit = function() {
      $scope.cancelCurrentOperations($scope.item);
      console.log('toggle edit clicked');
      if($scope.item.status.showEdit) {
        $scope.closeEditing();
      } else if(!$scope.item.status.showEdit) {
        $scope.openEditing();
      }
      $scope.item.status.showEdit = !$scope.item.status.showEdit;
    }



















    $scope.getSharedDescription = function () {
      if($scope.item.data.shared === 'yes')   return 'bookmark is public';
      else                                    return 'bookmark is private';
    }

    $scope.tagsToArray = function() {
      // break apart tags into an array
      return $scope.item.data.tags.split(' ');
    }

    $scope.clickTag = function(tag) {

      // open the tag filter toolbar
      $scope.config.showTags = true;
      // add this clicked tag to parent filter.tags model (if it's not in there)
      if($scope.filter.tags.length > 0) {
        var exists = false;
        for (var i=0; i<$scope.filter.tags.length; i++) {
          // console.log($scope.filter.tags[i].text);
          if($scope.filter.tags[i].text === tag) {
            exists = true;
            break;            
          }
        }
        if (exists === false) $scope.filter.tags.push( {text : tag} );
      } else {
        $scope.filter.tags.push( {text : tag} );
        $scope.applyFilters();
      }
      $scope.cancelCurrentOperations();
    }

    $scope.selectItem = function() {
      $scope.item.status.selected = !$scope.item.status.selected;
      // console.log("[ " + $scope.item.data.description + "] selected: " + $scope.item.status.selected);
      // add remove the item to parent scope selectedItems array
      if($scope.item.status.selected) {
        $scope.data.selectedItems.push($scope.item);
      } else if(!$scope.item.status.selected) {
        $scope.data.selectedItems.splice($scope.data.selectedItems.indexOf($scope.item), 1);
      }
      // show multi action bar when selectedItems.length > 2
      if($scope.data.selectedItems.length > 1) {
        $scope.config.showSelection = true;
      } else {
        $scope.config.showSelection = false;
      }
    }

    $scope.delete = function() {
      console.log('item delete clicked');
      var deleteConfirmed = confirm("Delete this bookmark ?");
      if(deleteConfirmed) {
        // call method in parent scope
        $scope.deleteBookmark($scope.item);
      }
    }

    $scope.staleCheck = function() {
      // $scope.cancelCurrentOperations();
      $scope.item.status.staleness = 'checking';
      Pinboardservice.checkUrl($scope.item.data.href)
      .then(function(result) {
        if(result == 200) {
          console.info('bookmarkitem healthy! ' + result);
          $scope.item.status.staleness = 'healthy';
        } else {
          console.info('bookmarkitem STALE! ' + result);
          $scope.item.status.staleness = 'dead';
        }
      }, function(reason) {
        console.info('bookmarkitem STALE! ' + reason);
        $scope.item.status.staleness = 'dead';
      });
      console.log('item stale check clicked: ' + $scope.item.data.href);
    }

    $scope.openBookmark = function(href) {
      gui.Shell.openExternal(href);
    }

  });