
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

    // copy for reference to old item values
    $scope.original = angular.copy($scope.item);
    $scope.itemWatcher = null;

    $scope.status = {
      hidden : true,
      hasChanged : false
    };

    $scope.addWatcher = function() {
      $scope.itemWatcher = $scope.$watch('item.tagname', function(newValue) {
        if(newValue === $scope.original.tagname) {
          $scope.status.hasChanged = false;
        } else {
          $scope.status.hasChanged = true;
        }
      });
    };

    $scope.removeWatcher = function() {
      $scope.itemWatcher();
    };

    $scope.openTagOptions = function() {
      console.log('opening tag options - with focus on: ' + focus);
      $scope.item.sizeY = 2;
      $scope.status.hidden = false;
      $scope.addWatcher();
    };

    $scope.closeTagOptions = function() {
      console.log('closing tag options!');
      $scope.item.sizeY = 1;
      $scope.status.hidden = true;
      $scope.removeWatcher();
    };

    $scope.toggleTagOptions = function() {
      if($scope.status.hidden)
        $scope.openTagOptions();
      else
        $scope.closeTagOptions();
    };

    $scope.selectTag = function(tag) {
      // push tag to filterBuffer
      Bookmarkservice.filterBuffer.tags.push({text : tag.tagname});
      Bookmarkservice.filterBuffer.tagFilterType = false;
      Bookmarkservice.filterBuffer.hasBuffer = true;

      // close tag options
      $scope.closeTagOptions();

      // redirect to overview page
      $location.path('/overview');
      return;
    };

    $scope.renameTag = function(tag) {

    };

    $scope.foldTag = function(tag) {

    };

    $scope.deleteTag = function() {
      Modalservice.confirm('', 'Delete this tag ?')
      .then(function(){
        // close tag options
        $scope.closeTagOptions();
        // call method in parent scope
        Pinboardservice.deleteTag();
      }, function() {
        console.log('modal cancelled.');
      });
    };

    $scope.revertChanges = function() {
      
    };

    $scope.saveChanges = function() {
      
    };

  });