
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('LoginCtrl', function ($scope, $location, $timeout, 
    Usersessionservice, Pinboardservice, Modalservice, Utilservice) {
    
    $scope.busy = false;
    $scope.loginAnimation = null;
    $scope.connection = false;
    $scope.username = '';
    $scope.password = '';

    $scope.loginEnter = function(keyEvent) {
      if (keyEvent.which === 13) {
        $scope.login($scope.username, $scope.password);
      }
    };

    $scope.getUserToken = function (username, password) {
      Pinboardservice.getUserToken(username, password)
      .then(function(result) {
          if (result) {
            if(result === '401' || result === 401) {
              console.info('not logged in: ' + result);
              $scope.loginAnimation = false;
            } else {
              console.info('logged in.');
              // set some stuff in Usersessionservice
              Usersessionservice.setAuthenticated($scope.username, result.result);
              // show loginbox outro anim
              $scope.loginAnimation = true;
              // reroute to main after anim out time
              $timeout(function(){
                $location.path('/main');
              }, 1000);
            }
          }
          
          // reset status vars
          $scope.busy = false;
          $timeout(function(){
            $scope.loginAnimation = null;
          }, 1000);

          // show failure reason
        }, function(reason) {
          console.error('Failed: ' + reason);
        });
    };

    $scope.login = function(username, password) {

      $scope.busy = true;

      if(!Utilservice.isEmpty(username) && !Utilservice.isEmpty(password)) {

        $scope.getUserToken(username, password);

        // Pinboardservice.checkConnection()
        // .then(function(result) {
        //   console.log(result);
        //   $scope.getUserToken(username, password);
        // }, function(failure) {
        //   console.log(failure);
        //   Modalservice.confirm('check again?', 'no internet connection!')
        //   .then(function() {
        //     $scope.login($scope.username, $scope.password);
        //   }, function() {
        //     // cancelled
        //   });
        // });
      } else {
        // todo error no input
      }

    };

    // Pinboardservice.checkConnection()
    //   .then(function() {
    //     // internet connection, do nothing
    //   }, function() {
    //     // NO internet connection. alert user
    //     Modalservice.alert('oops', 'no internet connection!');
    //   });

  });
