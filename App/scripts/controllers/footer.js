'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('FooterCtrl', function ($scope, Usersessionservice) {

    $scope.showFooter = true;

    $scope.$on('user:authenticated', function(event, data) {
      $scope.showFooter = Usersessionservice.isAuthenticated;
    });

  });