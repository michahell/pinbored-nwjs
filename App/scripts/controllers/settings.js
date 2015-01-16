
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('SettingsCtrl', function ($scope, Pinboardservice, Usersessionservice, $location) {
    
    // if not authenticated, redirect to login page
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path('/login');
      return;
    }

    // if logged off, redirect to login page as well
    $scope.$on('user:authenticated', function() { // args: event, data
      if(Usersessionservice.authenticated === false) {
        $location.path('/login');
        return;
      }
    });
    
    $scope.data = {
      test : false
    };

    // check if user is authenticated
    console.log('testing if authenticated..');

    // check if user is logged in on Pinboard
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path('/login');
      return;
    }

    // update current page
    Usersessionservice.setCurrentSection('settings');

  });
