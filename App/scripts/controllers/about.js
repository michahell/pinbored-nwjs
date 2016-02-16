
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('AboutCtrl', 
    ['$scope', '$controller', 
    'Pinboardservice', 'Usersessionservice', 'Utilservice',
    function ($scope, $controller,
      Pinboardservice, Usersessionservice, Utilservice) {

    // Initialize the super (controller) class and extend it.
    angular.extend(this, $controller('BaseViewCtrl', {$scope: $scope}));
    
    // page model
    $scope.model = {
      
    };

    $scope.$on('$viewContentLoaded', function() {
      console.info('about $viewContentLoaded called');
    });

    $scope.$on('$destroy', function() {
      console.info('about $destroy called');
    });

    // update current page
    Usersessionservice.setCurrentSection('about');

  }]);
