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

    // page model
    $scope.showNav = false;
    $scope.username = 'user';
    $scope.activePage = '';

    // root scope listeners
    $scope.$on('user:authenticated', function(event, data) {
      $scope.showNav = true;
      $scope.username = Usersessionservice.user;
    });

    $scope.$on('user:pagechange', function(event, currentPage) {
      $scope.activePage = Usersessionservice.currentPage;
    });

  });