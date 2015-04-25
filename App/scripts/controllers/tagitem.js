
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
      hidden : {
        rename : true,
        fold : true
      },
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

    $scope.toggleTagOptions = function(option) {
      if(option === 'fold')
        ($scope.status.hidden.fold === true) ? $scope.openTagOptions('fold') : $scope.closeTagOptions();
      else if(option === 'rename')
        ($scope.status.hidden.rename === true) ? $scope.openTagOptions('rename') : $scope.closeTagOptions();
    };

    $scope.openTagOptions = function(option) {
      console.log('opening tag option: ' + option);
      switch(option) {
        case 'fold' :
          $scope.status.hidden.fold = false;
        break;
        case 'rename' :
          $scope.status.hidden.rename = false;
        break;
      }
      $scope.item.sizeY = 2;
      $scope.addWatcher();
    };

    $scope.closeTagOptions = function(option) {
      console.log('closing tag options!');
      $scope.status.hidden.fold = true;
      $scope.status.hidden.rename = true;
      $scope.item.sizeY = 1;
      $scope.removeWatcher();
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

    $scope.renameTag = function(oldTagName, newTagName, type) {
      Pinboardservice.renameTag(oldTagName, newTagName)
        .then(function(result){
          console.log(result);
          if(result.result === 'done'){
            var str = (type === 'rename') ? 'renamed' : 'folded';
            // status update
            Appstatusservice.updateStatus('tag ' + str);
            // close tag options (also removes watcher)
            $scope.closeTagOptions();
            // make new original copy
            $scope.original = angular.copy($scope.item);
          }
        }, function(reason) {
          var str = (type === 'rename') ? 'renaming' : 'folding';
          Appstatusservice.updateStatus(str + ' tag failed: ' + reason + '.');
        });
    };

    $scope.foldTag = function(tag, intoTagName) {
      $scope.renameTag(tag.tagname, intoTagName, 'fold');
    };

    $scope.deleteTag = function(tag) {
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
    };

    $scope.rename = function(tag) {
      var originalTagName = $scope.original.tagname;
      console.log('Renaming from: ' + originalTagName + ' to: ' + tag.tagname + '...');
      $scope.renameTag(originalTagName, tag.tagname, 'rename');
    };

    $scope.fold = function(tag, intoTagName) {
      console.log('folding: ' + tag.tagname + ' into: ' + intoTagName + '...');
      $scope.foldTag(tag, intoTagName);
    };

    $scope.delete = function(tag) {
      Modalservice.confirm('', 'Delete this tag ?')
      .then(function() {
        $scope.deleteTag(tag);
      }, function() {
        console.log('modal cancelled.');
      });
    };

    $scope.applyFold = function() {
      console.log('applying fold...');
      // apply

      // remove item (it has folded...)

      // update count of folded into tag

    };

    $scope.revertChanges = function(tag) {
      $scope.item.tagname = $scope.original.tagname;
    };

    $scope.saveChanges = function(tag) {
      $scope.renameTag($scope.original.tagname, tag.tagname);
    };

  });