
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:TagItemCtrl
 * @description
 * # TagItemCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('TagItemCtrl', function ($scope, $location,
    Usersessionservice, Pinboardservice, Appstatusservice, Modalservice, Bookmarkservice) {

    try {
      var gui = require('nw.gui');
    } catch (error) {
      console.error('error loading nw.gui: ' + error);
    }

    // current item!
    // $scope.item

    $scope.selectTagUnique = function(tag) {
      Bookmarkservice.filterBuffer.tags.push({text : tag.tagname});
      Bookmarkservice.filterBuffer.tagFilterType = true;
      Bookmarkservice.filterBuffer.hasBuffer = true;

      // redirect to overview page
      $location.path('/overview');
      return;
    };

    $scope.selectTag = function(tag) {
      Bookmarkservice.filterBuffer.tags.push({text : tag.tagname});
      Bookmarkservice.filterBuffer.tagFilterType = false;
      Bookmarkservice.filterBuffer.hasBuffer = true;

      // redirect to overview page
      $location.path('/overview');
      return;
    };

    $scope.deleteTag = function() {
      Modalservice.confirm('', 'Delete this tag ?')
      .then(function(){
        // call method in parent scope
        Pinboardservice.deleteTag();
      }, function() {
        console.log('modal cancelled.');
      });
    };

  });