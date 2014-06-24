'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainCtrl', function ($scope, Pinboardservice, Usersessionservice, $location) {
    
    // check if user is logged in on Pinboard
    var us = Usersessionservice;
    
    if (us.isAuthenticated == false) {
      $location.path("/login");
    }

    var ps = Pinboardservice;
    
  });
