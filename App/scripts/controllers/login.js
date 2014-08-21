'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('LoginCtrl', function ($scope, Usersessionservice, Pinboardservice, $location) {
    
    $scope.busy = false;
    $scope.pstatus = null;

    $scope.login = function(username, password) {

      $scope.busy = true;
      // console.log('login called with: ' + username + ' and: ' + password);

      Pinboardservice.getUserToken(username, password)
      .then(function(result) {

        if (result) {
          if(result == '401 forbidden') {
            console.info('not logged in: ' + result);
            $scope.pstatus = false;
          } else {
            console.info('logged in.');
            // set some stuff in Usersessionservice
            Usersessionservice.setAuthenticated(username, result.result);
            // show loginbox outro anim
            $scope.pstatus = true;
            // reroute to main
            $location.path('/main');
          }
        }
        
        // reset status vars
        $scope.busy = false;
        setTimeout(function(){
          $scope.pstatus = null;
        }, 500);

          // show stuff
        }, function(reason) {
          console.info('Failed: ' + reason);
        });

    }

  });
