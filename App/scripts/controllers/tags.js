
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('TagsCtrl', function ($scope, Pinboardservice, Usersessionservice, $location) {
    
    // if not authenticated, redirect to login page
    if (Usersessionservice.isAuthenticated() === false) {
      $location.path('/login');
      return;
    }

    // if logged off, redirect to login page as well
    $scope.$on('user:authenticated', function() { // args: event, data
      if(Usersessionservice.authenticated === false) {
        $location.path('/login');
        return;
      }
    });

    // page model
    $scope.data = {
      //filteredList
      isLoading : true,
      tags : [],
      numTags : 0
    };

    // update current page
    Usersessionservice.setCurrentPage('tags');

    // function createTags(tagdata) {
    //   for (var tag in tagdata) {
    //     // console.log(tag, tagdata[tag]);
    //     $scope.data.tags.push({
    //       tagname : tag,
    //       occurrences : tagdata[tag]
    //     });
    //   }
    //   // console.log($scope.data.tags);
    //   $scope.data.numTags = $scope.data.tags.length;
    // }

    // get all tags
    console.log('getting ALL tags...');
    
    // Pinboardservice.getAllTags()
    // .then(function(result) {
    //   $scope.data.isLoading = false;
    //   $scope.data.tags = createTags(result);
    // }, function(failreason) {
    //   console.error('Failed: ' + failreason);
    // });

  });
