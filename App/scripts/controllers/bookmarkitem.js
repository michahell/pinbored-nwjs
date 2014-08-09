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