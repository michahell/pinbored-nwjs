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

    var us = Usersessionservice;

    $scope.isAuthenticated = us.isAuthenticated;
    $scope.currentUser = null;

  });