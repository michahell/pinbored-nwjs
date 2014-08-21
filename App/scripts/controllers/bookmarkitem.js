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

    // break apart tags into an array
    $scope.item.tagsList = $scope.item.data.tags.split(' ');

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
      }

      // console.log($scope.filter.tags);
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
      
      // console.info($scope.data.selectedItems);
    }

    $scope.toggleEdit = function() {
      $scope.cancelCurrentOperations($scope.item);
      console.log('toggle edit clicked');
      $scope.item.status.showEdit = !$scope.item.status.showEdit;
    }

    $scope.update = function() {
      console.log('item update clicked');
    }

    $scope.reset = function() {
      console.log('item reset clicked');
    }

    $scope.delete = function() {
      console.log('item delete clicked');
    }

    $scope.staleCheck = function() {
      $scope.cancelCurrentOperations();
      Pinboardservice.checkUrl($scope.item.data.href)
      .then(function(result) {
        if(result == 200) {
          console.info('bookmarkitem healthy! ' + result);
        } else {
          console.info('bookmarkitem STALE! ' + result);
        }
      }, function(reason) {
        console.info('bookmarkitem STALE! ' + reason);
      });
      console.log('item stale check clicked: ' + $scope.item.data.href);
    }

    $scope.openBookmark = function(href) {
      gui.Shell.openExternal(href);
    }

  });