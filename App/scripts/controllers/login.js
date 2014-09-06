'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('LoginCtrl', function ($scope, Usersessionservice, Pinboardservice, $location, $timeout) {
    
    $scope.busy = false;
    $scope.pstatus = null;

    $scope.loginEnter = function(keyEvent) {
      if (keyEvent.which === 13)
        $scope.login();
    }

    $scope.login = function() {

      $scope.busy = true;

      Pinboardservice.getUserToken($scope.username, $scope.password)
      .then(function(result) {
          if (result) {
            if(result == '401') {
              console.info('not logged in: ' + result);
              $scope.pstatus = false;
            } else {
              console.info('logged in.');
              // set some stuff in Usersessionservice
              Usersessionservice.setAuthenticated($scope.username, result.result);
              // show loginbox outro anim
              $scope.pstatus = true;
              // reroute to main after anim out time
              $timeout(function(){
                $location.path('/main');
              }, 1000);
            }
          }
          
          // reset status vars
          $scope.busy = false;
          $timeout(function(){
            $scope.pstatus = null;
          }, 1000);

          // show failure reason
        }, function(reason) {
          console.error('Failed: ' + reason);
        });

    }

  });
