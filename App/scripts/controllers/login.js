'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('LoginCtrl', function ($scope, Usersessionservice, Pinboardservice) {
    
    var ps = Pinboardservice;

    $scope.login = function(username, password) {

      console.log('login called with: ' + username + ' and: ' + password);

      ps.getUserToken(username, password)
      .then(function(result) {
        // console.info('Success: ' + result);
        
        // try to parse result
        var parsedjson;
        try {
          parsedjson = JSON.parse(result);
        } catch (exception) {
          parsedjson = null;
        }

        if (parsedjson) {
          console.info('test: ' + parsedjson);
        }

          // show stuff
        }, function(reason) {
          console.info('Failed: ' + reason);

        }, function(update) {
          console.info('Got notification: ' + update);
        });

    }

  });
