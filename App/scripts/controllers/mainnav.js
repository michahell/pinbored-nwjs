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
    $scope.$on('user:authenticated', function() { // args: event, data
      if(Usersessionservice.authenticated === true) {
        $scope.showNav = true;
        $scope.username = Usersessionservice.user;
      } else if(Usersessionservice.authenticated === false) {
        $scope.showNav = false;
        return;
      }
    });

    $scope.$on('user:pagechange', function() { // args: event, currentPage
      $scope.activePage = Usersessionservice.currentPage;
    });

    $scope.logout = function() {
      // TODO logout
      console.log('logging out...');
      Usersessionservice.destroy();
      console.info('logged out.');
    };

  });