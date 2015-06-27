
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('SettingsCtrl', 
    ['$scope', '$controller', '$location', 'Pinboardservice', 'Usersessionservice', 'Utilservice', 'Appconfigservice',
    function ($scope, $controller, $location, Pinboardservice, Usersessionservice, Utilservice, Appconfigservice) {
    
    // if not authenticated, redirect to login page
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path('/login');
      return;
    }

    // Initialize the super (controller) class and extend it.
    angular.extend(this, $controller('BaseViewCtrl', {$scope: $scope}));

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

    $scope.$on('$viewContentLoaded', function() {
      console.info('settings $viewContentLoaded called');

      // force local $scope copy of app config obj.
      $scope.onAppconfigChanged();
    });

    $scope.$on('$destroy', function() {
      console.info('settings $destroy called');
    });

    // update current page
    Usersessionservice.setCurrentSection('settings');

    // set event hooks / listeners
    $scope.$on('app:configchanged', $scope.onAppconfigChanged);

  }]);
