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

    $scope.isExpanded = false;

    var gui = require('nw.gui');

    // current item!
    // $scope.item

    $scope.toggleExpand = function() {
      console.log('toggleExpand clicked');
      $scope.isExpanded = !$scope.isExpanded;
    }

    $scope.openBookmark = function(href) {
      gui.Shell.openExternal(href);
    }

  });