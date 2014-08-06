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

    $scope.toggleExpand = function() {
      console.log('toggleExpand clicked');
      $scope.isExpanded = !$scope.isExpanded;
    }

  });