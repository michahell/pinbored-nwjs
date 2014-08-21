'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('SettingsCtrl', function ($scope, Pinboardservice, Usersessionservice, $location) {
    
    $scope.data = {
      test : false
    }

    // check if user is authenticated
    console.log("testing if authenticated..");

    // check if user is logged in on Pinboard
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path("/login");
      return;
    }

    // update current page
    Usersessionservice.setCurrentPage('settings');

  });
