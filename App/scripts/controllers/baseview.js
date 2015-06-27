
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:BaseViewCtrl
 * @description
 * # BaseViewCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('BaseViewCtrl', 
    ['$scope', 'Usersessionservice', 'Utilservice', 'Appconfigservice',
    function ($scope, Usersessionservice, Utilservice, Appconfigservice) {
    
    // shared base view model
    $scope.model = {
      
    };

    $scope.$on('$viewContentLoaded', function() {
      console.info('base view controller $viewContentLoaded called');

      // @exclude
      window.$scope = $scope;
      // @endexclude
    });

    $scope.$on('$destroy', function() {
      console.info('base view controller $destroy called');
    });

  }]);
