'use strict';

/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('TagsCtrl', function ($scope, Pinboardservice, Usersessionservice, $location) {
    
    $scope.data = {
      isLoading : true,
      tags : []
    }

    // check if user is logged in on Pinboard
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path("/login");
    }

    function createTags(tagdata) {
      for (var tag in tagdata) {
        // console.log(tag, tagdata[tag]);
        $scope.data.tags.push({tag, tagdata[tag]})
      }
    }

    // get all tags
    console.log("getting ALL tags...");
    Pinboardservice.getAllTags()
    .then(function(result) {
      $scope.data.isLoading = false;
      $scope.data.tags = createTags(result);
    }, function(failreason) {
      console.error('Failed: ' + failreason);
    });

  });
