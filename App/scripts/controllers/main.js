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
    
    $scope.data = {
      pagerange : [],
      activepage : 5,
      items: []
    }

    for(var i = 0; i < 25; i++) {
      $scope.data.pagerange.push('page' + i);
    }

    for(var i = 0; i < 75; i++) {
      $scope.data.items.push('item' + i);
    }

    // check if user is logged in on Pinboard
    if (Usersessionservice.isAuthenticated == false) {
      // $location.path("/login");
    }

    stroll.bind('#list ul', { live: true } );

  });
