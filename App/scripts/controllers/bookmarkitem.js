
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:BookmarkItemCtrl
 * @description
 * # BookmarkItemCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('BookmarkItemCtrl', function ($scope, 
    Usersessionservice, Pinboardservice, Appstatusservice, Modalservice) {

    try {
      var gui = require('nw.gui');
    } catch (error) {
      console.error('error loading nw.gui: ' + error);
    }

    // current item!
    // $scope.item

    // copy of current item
    $scope.itemcopy = null;

    // current item watcher and proxy watcher
    $scope.itemWatcher = null;
    $scope.proxyWatcher = null;

    // proxy item model... ugly workaround, sigh.
    $scope.itemproxy = {
      tags : [],
      toread : false,
      shared : false
    };

    $scope.showItemproxyTags = function() {
      // console.log($scope.itemproxy.tags);
    };

    $scope.updateItemProxyTags = function() {
      $scope.proxyChanged();
    };

    $scope.checkTagHighlight = function(tag) {
      // check parent scope tag filter list
      for(var i=0; i<$scope.filter.tags.length; i++) {
        if($scope.filter.tags[i].text === tag) {
          return true;
        }
      }
      return false;
    };

    $scope.update = function() {
      Appstatusservice.updateStatus('updating bookmark...');
      // request update
      Pinboardservice.updateBookmark($scope.item)
      .then(function(result) {
        if(result.result_code === 'done') {
          // status update!
          Appstatusservice.updateStatus('bookmarkitem updated.');
          // remove watchers FIRST
          $scope.removeWatchers();
          // 'soft' reset the current bookmark item
          $scope.item.status.hasChanged = false;
          // deep copy the current item
          $scope.itemcopy = angular.copy($scope.item);
          // re-add the watchers
          $scope.addWatchers();
        } else {
          console.info(result);
        }
      }, function(reason) {
        console.error('updating bookmarkitem failed: ' + reason);
        Appstatusservice.updateStatus('updating bookmarkitem failed: ' + reason + '.');
      });
    };

    $scope.reset = function() {
      console.log('item reset clicked');
      $scope.resetBookmark();
    };

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
        // also reset the item proxy data
        $scope.mapToProxyValues();
        console.log('reset to previous item state.');
        $scope.item.status.hasChanged = false;
      } else {
        console.log('nothing reset since bookmark was unchanged.');
      }
    };

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
      // map item tags to proxy tags
      $scope.itemproxy.tags = $scope.tagObjectsFromBookmark();
    };

    $scope.closeEditing = function() {
      // remove watcher FIRST
      $scope.removeWatchers();
      // then, reset bookmark
      $scope.resetBookmark();
    };

    $scope.openEditing = function() {
      // deep copy the current item
      $scope.itemcopy = angular.copy($scope.item);
      // map toread and shared to proxy values
      $scope.mapToProxyValues();
      // start watching the current item
      $scope.addWatchers();
    };

    $scope.currentItemChanged = function() {
      console.log('item change detected!');
      $scope.item.status.hasChanged = !angular.equals($scope.item.data, $scope.itemcopy.data);
      // console.log('item DATA has changed compared to item copy DATA: ');
      // console.log($scope.item.status.hasChanged);
    };

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
      // map proxy tags to item tags
      $scope.item.data.tags = $scope.tagObjectsToBookmark();
    };

    $scope.removeWatchers = function() {
      // remove watcher if it exists
      if($scope.itemWatcher !== null) {
        $scope.itemWatcher();
      }
      if($scope.proxyWatcher !== null) {
        $scope.proxyWatcher();
      }
    };

    $scope.addWatchers = function() {
      $scope.itemWatcher = $scope.$watchCollection('item.data', function() { //newItem, oldItem
        $scope.currentItemChanged();
      });
      $scope.proxyWatcher = $scope.$watchCollection('itemproxy', function() { //newItem, oldItem
        console.log('item proxy changed...');
        $scope.proxyChanged();
      });
      console.log('set up watcher for current item...');
    };

    $scope.toggleEdit = function() {
      $scope.cancelCurrentOperations($scope.item);
      console.log('toggle edit clicked');
      if($scope.item.status.showEdit) {
        $scope.closeEditing();
      } else if(!$scope.item.status.showEdit) {
        $scope.openEditing();
      }
      $scope.item.status.showEdit = !$scope.item.status.showEdit;
    };

    $scope.getSharedDescription = function () {
      if($scope.item.data.shared === 'yes') {
        return 'bookmark is public';
      } else {
        return 'bookmark is private';
      }      
    };

    $scope.tagsToArray = function() {
      // break apart tags into an array
      return $scope.item.data.tags.split(' ');
    };

    $scope.tagObjectsFromBookmark = function() {
      // break apart tags into an array
      var tagsList = $scope.item.data.tags.split(' ');
      var objList = [];
      // create object for each tag in the list
      for (var i=0; i<tagsList.length; i++) { 
        objList.push({text : tagsList[i]});
      }
      return objList;
    };

    $scope.tagObjectsToBookmark = function() {
      var tagsList = [];
      // create object for each tag in the list
      for (var i=0; i<$scope.itemproxy.tags.length; i++) { 
        tagsList.push($scope.itemproxy.tags[i].text);
      }
      return tagsList.join(' ');
    };

    $scope.clickTag = function(tag) {

      // open the tag filter toolbar
      $scope.config.showTags = true;
      // add this clicked tag to parent filter.tags model (if it's not in there)
      if($scope.filter.tags.length > 0) {
        var exists = false;
        // check if the tag already is in the filter list
        for (var i=0; i<$scope.filter.tags.length; i++) {
          // console.log($scope.filter.tags[i].text);
          if($scope.filter.tags[i].text === tag) {
            exists = true;
            break;            
          }
        }
        // it is not, so add it and update
        if (exists === false) {
          $scope.filter.tags.push( {text : tag} );
          $scope.checkMaxTags();
          console.log('applying filters..');
          $scope.updateFiltersPaging();
        }
      } else {
        // there are no tags in the filter list so add straight away
        $scope.filter.tags.push( {text : tag} );
        $scope.updateFiltersPaging();
      }
      $scope.cancelCurrentOperations();
    };

    $scope.selectItem = function() {
      $scope.item.status.selected = !$scope.item.status.selected;
      // console.log("[ " + $scope.item.data.description + "] selected: " + $scope.item.status.selected);
      // add remove the item to parent scope selectedItems array
      if($scope.item.status.selected) {
        $scope.data.selectedItems.push($scope.item);
      } else if(!$scope.item.status.selected) {
        $scope.data.selectedItems.splice($scope.data.selectedItems.indexOf($scope.item), 1);
      }
    };

    $scope.delete = function() {
      Modalservice.confirm('', 'Delete this bookmark ?')
      .then(function(){
        // call method in parent scope
        $scope.deleteBookmark($scope.item);
      }, function() {
        console.log('modal cancelled.');
      });
      
    };

    $scope.staleCheck = function(bookmark) {
      // console.log(bookmark);
      // $scope.cancelCurrentOperations();
      $scope.staleCheckBookmark(bookmark);
    };

    $scope.openBookmark = function(href) {
      // console.log('openBookmark gets called with: ');
      // console.log(href);
      gui.Shell.openExternal(href);
    };

  });