'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainCtrl', function ($scope, Pinboardservice) {
    
    // $scope.awesomeThings = [
    //   'HTML5 Boilerplate',
    //   'AngularJS',
    //   'Karma'
    // ];

    var ps = Pinboardservice;
    
    // maybe node.js modules need some loading time or wtf?

    window.setTimeout(function() {

      ps.getUserToken('test', 'test2')
        .then(function(data) {
          console.info('Success: ' + data);
          
          var test = JSON.parse(data);
          console.info('test: ' + test);

          // show stuff
        }, function(reason) {
          console.info('Failed: ' + reason);
        }, function(update) {
          console.info('Got notification: ' + update);
        });

    }, 1000);

  });
