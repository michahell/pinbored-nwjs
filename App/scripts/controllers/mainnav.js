'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainNavCtrl', function ($scope, Usersessionservice) {

    $scope.showNav = false;
    $scope.username = 'user';

    $scope.$on('user:authenticated', function(event, data) {
      $scope.showNav = true;
      $scope.username = Usersessionservice.user;
    });

    Usersessionservice.isAuthenticated();

  });