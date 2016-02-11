
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:BaseViewCtrl
 * @description
 * # BaseViewCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('BaseViewCtrl', 
    ['$scope', '$location', 'Appconfigservice', 'Usersessionservice',
    function ($scope, $location, Appconfigservice, Usersessionservice) {
    
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

    $scope.appconfig = {}; // gets populated by Appconfigservice !

    $scope.onAppconfigChanged = function() {
      $scope.appconfig = Appconfigservice.getConfig();
    };

    $scope.$on('$viewContentLoaded', function() {
      // console.info('base view controller $viewContentLoaded called');
      // force local $scope copy of app config obj.
      $scope.onAppconfigChanged();

      // @exclude
      window.$scope = $scope;
      // @endexclude
    });

    $scope.$on('$destroy', function() {
      // console.info('base view controller $destroy called');
    });

    // set event hooks / listeners
    $scope.$on('app:configchanged', $scope.onAppconfigChanged);

  }]);
