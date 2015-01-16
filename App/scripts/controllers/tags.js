
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('TagsCtrl', function ($scope, Pinboardservice, Appstatusservice, 
    Usersessionservice, $location) {
    
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
    $scope.paging = {
      numPageButtons : 10,
      current : 1,
      total : 0
    };

    $scope.data = {
      isLoading : true,
      tags : [],
      numTags : 0
    };

    $scope.config = {
      showPager : false,
      itemsPerPage : 39       // 13 rows * 3 cols
    };

    $scope.createTags = function(tagdata) {

      // console.log(tagdata);

      for (var tag in tagdata) {
        // console.log(tag, tagdata[tag]);
        $scope.data.tags.push({
          tagname : tag,
          occurrences : parseInt(tagdata[tag])
        });
      }
      
      console.log($scope.data.tags);
      
      $scope.data.numTags = $scope.data.tags.length;
      $scope.paging.total = $scope.data.tags.length;

      if($scope.data.numTags > 0) {
        console.log($scope.data.numTags + ' tags retrieved.');
        return true;
      } else {
        console.warn('no tags received, so no tags created.');
        return false;
      }
    }

    $scope.repopulateTags = function() {
      // get all tags  
      Appstatusservice.updateStatus('retrieving all tags...');
      
      Pinboardservice.getAllTags()
      .then(function(result) {
        if($scope.createTags(result)) {
          $scope.data.isLoading = false;
          // 'insta' show paging bar
          $scope.config.showPager = true;
          Appstatusservice.updateStatus('all tags retrieved.');
        }
      }, function(failreason) {
        console.error('Failed: ' + failreason);
      });
    }





    // SETUP AND INITIALISATION


    

    // update current page
    Usersessionservice.setCurrentSection('tags');

    // repopulate bookmark items.
    $scope.repopulateTags();

    // for debugging reasons
    window.$scope = $scope;

  });
