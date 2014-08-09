'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('TagsCtrl', function ($scope, Pinboardservice, Usersessionservice, $location) {
    
    $scope.data = {
      test : '1'
    }

    // check if user is logged in on Pinboard
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path("/login");
    }

  });
