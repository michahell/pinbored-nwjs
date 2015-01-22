
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
      if ($scope.itemWatcher !== null)
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

    $scope.renameTag = function(oldTagName, newTagName) {
      Pinboardservice.renameTag(oldTagName, newTagName)
        .then(function(result){
          console.log(result);
          if(result.result === 'done'){
            // status update!
            Appstatusservice.updateStatus('tag renamed.');
            // close tag options (also removes watcher)
            $scope.closeTagOptions();
            // make new original copy
            $scope.original = angular.copy($scope.item);
          }
        }, function(reason) {
          console.error('renaming tag failed: ' + reason);
          Appstatusservice.updateStatus('renaming tag failed: ' + reason + '.');
        });
    };

    $scope.foldTag = function(oldTagName, newTagName) {
      $scope.renameTag(oldTagName, newTagName);
    };

    $scope.deleteTag = function(tag) {
      Modalservice.confirm('', 'Delete this tag ?')
      .then(function(){
        // call method in parent scope
        Pinboardservice.deleteTag(tag.tagname)
        .then(function(result){
          // console.log(result);
          if(result.result === 'done'){
            // status update!
            Appstatusservice.updateStatus('tag deleted.');
            // close tag options (also removes watcher)
            $scope.closeTagOptions();
            // delete tag item
            $scope.$parent.removeTag(tag);
          }
        }, function(reason) {
        console.error('deleting tag failed: ' + reason);
        Appstatusservice.updateStatus('deleting tag failed: ' + reason + '.');
        });
      }, function() {
        console.log('modal cancelled.');
      });
    };

    $scope.revertChanges = function(tag) {
      $scope.item.tagname = $scope.original.tagname;
    };

    $scope.saveChanges = function(tag) {
      $scope.renameTag($scope.original.tagname, tag.tagname);
    };

  });