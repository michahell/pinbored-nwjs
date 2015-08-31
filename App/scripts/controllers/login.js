
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('LoginCtrl', 
    ['$q', '$scope', '$controller', '$location', '$timeout', 'Usersessionservice', 'Pinboardservice', 
    'Modalservice', 'Utilservice', 
    function ($q, $scope, $controller, $location, $timeout, Usersessionservice, Pinboardservice, 
      Modalservice, Utilservice) {
    
    // Initialize the super (controller) class and extend it.
    angular.extend(this, $controller('BaseViewCtrl', {$scope: $scope}));

    $scope.model = {
      busy : false,
      loginAnimation : null,
      username : '',
      password : ''
    };

    $scope.loginEnter = function(keyEvent) {
      if (keyEvent.which === 13) {
        $scope.login($scope.model.username, $scope.model.password);
      }
    };

    $scope.getUserToken = function (username, password) {
      var deferred = $q.defer();

      Pinboardservice.getUserToken(username, password)
      .then(function(result) {
        if (result) {
          // Unauthorized
          if(Number(result) === 401) {   // a number indicates we failed, no login...
            console.warn('failed, not logged in. ', result);
            deferred.reject(Number(result));
          // Service Unavailable
          } else if(Number(result) >= 500 && Number(result) <= 510) {
            console.warn('service unavailable.');
            deferred.reject(Number(result));
          // Authorized (request success)
          } else if(result != {} && result.result.length === 20) { // now we get a string token back, OMGtyping.
            console.info('logged in.');
            deferred.resolve(result.result);
          }
        }
      })
      .catch(function(reason) {
        console.warn('Failed, not logged in. ', reason);
        $scope.model.loginAnimation = false;
        deferred.reject('Failed, not logged in. ', reason);
      });

      return deferred.promise;
    };

    $scope.login = function(username, password) {
      $scope.model.busy = true;

      if(!Utilservice.isEmpty(username) && !Utilservice.isEmpty(password)) {
        Pinboardservice.checkConnection()
        .then(function(adresses) {
          // console.log(adresses);
          return $scope.getUserToken(username, password);
        })
        .then(function(userTokenID) {
          // set some stuff in Usersessionservice
          Usersessionservice.setAuthenticated($scope.model.username, userTokenID);
          // show loginbox outro anim
          $scope.model.loginAnimation = true;
          // reroute to main after anim out time
          $timeout(function() {
            $location.path('/overview');
          }, 1000);
        })
        .catch(function(failure) {
          $scope.model.loginAnimation = false;
          $scope.model.busy = false;
          $timeout(function() {
            $scope.model.loginAnimation = null;
          }, 1000);
          console.warn(failure);
          if(failure === '') {
            Modalservice.confirm('No internet connection', 'It seems there is no internet connection. Retry (OK) or go offline (cancel) ?')
            .then(function() {
              // retry login
              $scope.login($scope.model.username, $scope.model.password);
            })
          }
        })
        
      } else {
        // todo error no input
        Modalservice.alert('Insufficient input', 'Please fill out both username and password.');
      }
    };

    $scope.$on('$viewContentLoaded', function() {
      console.info('login $viewContentLoaded called');

      // add entrance classes.
      $timeout(function() {
        $scope.model.loginAnimation = 'login';
        $timeout(function() {
          $scope.model.loginAnimation = null;
        }, 1500);
      }, 750);
    });

    $scope.$on("$destroy", function() {
      console.info('login $destroy called');
    });

  }]);
