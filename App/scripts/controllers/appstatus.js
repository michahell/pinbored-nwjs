
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:AppStatusCtrl
 * @description
 * # AppStatusCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('AppStatusCtrl', 
    ['$scope', 'Usersessionservice', 'Events', 
    function ($scope, Usersessionservice, Events) {
    
    $scope.status = {
      text : '',
      progress : 0,
      total : 0
    };

    $scope.countingDown = 0;
    $scope.timeVisible = 5000;
    $scope.visible = false;

    // if app status updates in the model reflect these changes
    $scope.$on(Events.app.statusupdate, function(event, status) {
      
      $scope.visible = true;
      $scope.status = status;

      // reset time visible
      $scope.timeVisible = 5000;

      // set up the counting down for hiding the app status footer
      var countingDown = setInterval(function() {
        
        if($scope.timeVisible <= 0) {
          $scope.$apply($scope.visible = false);
          clearInterval(countingDown);
          countingDown = 0;
          $scope.timeVisible = 5000;
        } else {
          $scope.timeVisible -= 100;  
        }
        
      }, 100);

    });

  }]);