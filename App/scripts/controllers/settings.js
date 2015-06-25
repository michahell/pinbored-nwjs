
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('SettingsCtrl', function ($scope, Pinboardservice, Usersessionservice, 
    Utilservice, Appconfigservice, $location) {
    
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
    
    // page model
    $scope.model = {
      test : false
    };

    $scope.appconfig = {} // gets populated by Appconfigservice !

    $scope.onAppconfigChanged = function() {
      $scope.appconfig = Appconfigservice.getConfig();
    };

    // update current page
    Usersessionservice.setCurrentSection('settings');

    // set event hooks / listeners
    $scope.$on('app:configchanged', $scope.onAppconfigChanged);
    // force local $scope copy of app config obj.
    $scope.onAppconfigChanged();

  });
