
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:BaseViewCtrl
 * @description
 * # BaseViewCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('BaseViewCtrl', 
    ['$scope', 'Appconfigservice', 
    function ($scope, Appconfigservice) {
    
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
