'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:BookmarkItemCtrl
 * @description
 * # BookmarkItemCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('BookmarkItemCtrl', function ($scope, Usersessionservice) {

    $scope.showExtended = false;
    $scope.showEdit = false;

    var gui = require('nw.gui');

    // current item!
    // $scope.item

    // break apart tags into an array
    $scope.item.tagsList = $scope.item.tags.split(' ');

    $scope.clickTag = function(tag) {
      console.log('tag clicked: ' + tag);
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

      console.log($scope.filter.tags);
    }

    $scope.toggleExtended = function() {
      console.log('toggleExtended clicked');
      $scope.showExtended = !$scope.showExtended;
    }

    $scope.toggleEdit = function() {
      console.log('toggle edit clicked');
      $scope.showEdit = !$scope.showEdit;
    }

    $scope.update = function() {
      console.log('item update clicked');
    }

    $scope.delete = function() {
      console.log('item delete clicked');
    }

    $scope.staleCheck = function() {
      console.log('item stale check clicked');
    }

    $scope.openBookmark = function(href) {
      gui.Shell.openExternal(href);
    }

  });