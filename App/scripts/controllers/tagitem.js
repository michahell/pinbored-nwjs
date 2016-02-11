
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:TagItemCtrl
 * @description
 * # TagItemCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('TagItemCtrl', 
    ['$q', '$scope', '$location', '$filter','Usersessionservice', 'Pinboardservice', 'Appstatusservice', 
    'Modalservice', 'Bookmarkservice',
    function ($q, $scope, $location, $filter, Usersessionservice, Pinboardservice, Appstatusservice, 
    Modalservice, Bookmarkservice) {

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
      hasNameChanged : false,
      hasFoldChanged : false,
      newFoldTags : []
    };

    $scope.spliceMaxTags = function() {
      // remove last tag from array
      if($scope.status.newFoldTags.length > 1) {
        $scope.status.newFoldTags.splice(
          $scope.status.newFoldTags.indexOf(
            $scope.status.newFoldTags[$scope.status.newFoldTags.length - 1]
          ), 
        1);
      }
    };

    $scope.onTagAdded = function() { // @param tag
      // enable savechanges
      $scope.status.hasFoldChanged = true;
      // remove extra added tags (custom max tags..)
      $scope.spliceMaxTags();
    };

    $scope.onTagRemoved = function() {  // @param tag
      // enable savechanges
      $scope.status.hasFoldChanged = false;
    };

    $scope.addWatcher = function() {
      $scope.itemWatcher = $scope.$watch('item.tagname', function(newValue) {
        if(newValue === $scope.original.tagname) {
          $scope.status.hasNameChanged = false;
        } else {
          $scope.status.hasNameChanged = true;
        }
      });
    };

    $scope.removeWatcher = function() {
      if ($scope.itemWatcher !== null) {
        $scope.itemWatcher();
      }
    };

    $scope.toggleTagOptions = function(option) {
      if(option === 'fold') {
        if($scope.status.hidden.fold === true) {
          $scope.openTagOptions('fold') 
        } else {
          $scope.closeTagOptions();
        }
      } else if(option === 'rename') {
        if($scope.status.hidden.rename === true) { 
          $scope.openTagOptions('rename') 
        } else {
          $scope.closeTagOptions();
        }
      }
    };

    $scope.openTagOptions = function(option) {
      console.log('opening tag option: ' + option);
      $scope.status.hidden.fold = (option === 'fold') ? false : true;
      $scope.status.hidden.rename = (option === 'rename') ? false : true;
      $scope.item.sizeY = 2;
      $scope.addWatcher();
    };

    $scope.closeTagOptions = function() {
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
      var deferred = $q.defer();
      var pastTense = (type === 'rename') ? 'renamed' : 'folded';
      var currentTense = (type === 'rename') ? 'renaming' : 'folding';
      console.log(currentTense, oldTagName, ' into: ' + newTagName + '...');

      Pinboardservice.renameTag(oldTagName, newTagName)
      .then(function(result) {
        console.log(currentTense + ' tag successfull: ', result);
        if(result.result === 'done') {
          // status update
          Appstatusservice.updateStatus('tag ' + pastTense);
          // close tag options (also removes watcher)
          $scope.closeTagOptions();
          if(type === 'rename') {
            // make new original copy
            $scope.original = angular.copy($scope.item);
          }
          deferred.resolve();
        }
      })
      .catch(function(reason) {
        Appstatusservice.updateStatus(pastTense + ' tag failed: ' + reason + '.');
        deferred.reject();
      });
      return deferred.promise;
    };

    $scope.foldTag = function(tag, intoTagName) {
      $scope.renameTag(tag.tagname, intoTagName, 'fold')
      .then(function() {
        // remove tag visibly
        var obsoleteTag = $scope.$parent.getTagByName(tag.tagname);
        var foldedIntoTag = $scope.$parent.getTagByName(intoTagName);
        console.log('trying to get tag: ', tag.tagname, obsoleteTag);
        if(obsoleteTag !== undefined && !obsoleteTag !== null) {
          $scope.$parent.removeTag(obsoleteTag);
          // increase selected tag count
          $scope.$parent.increaseTagOccurenceCount(foldedIntoTag);
        }
      })
      .catch(function(error) {
        console.error(error);
      });
    };

    $scope.deleteTag = function(tag) {
      Modalservice.confirm('', 'Delete this tag ?')
      .then(function() {
        // call method in parent scope
        return Pinboardservice.deleteTag(tag.tagname)
      })
      .then(function(result) {
        // console.log(result);
        if(result.result === 'done') {
          // status update!
          Appstatusservice.updateStatus('tag deleted.');
          // close tag options (also removes watcher)
          $scope.closeTagOptions();
          // delete tag item
          $scope.$parent.removeTag(tag);
        }
      })
      .catch(function(reason) {
        console.error('delete tag failed: ' + reason);
        Appstatusservice.updateStatus('deleting tag failed: ' + reason + '.');
      });
    };

    $scope.revertRenameChanges = function() {
      // console.log('revert rename changes called.');
      $scope.item.tagname = $scope.original.tagname;
    };

    $scope.saveRenameChanges = function(tag) {
      // console.log('save rename changes called.');
      $scope.renameTag($scope.original.tagname, tag.tagname, 'rename');
    };

    $scope.saveFoldChanges = function(tag) {
      // console.log('save fold changes called.');
      $scope.foldTag(tag, $scope.status.newFoldTags[0].text);
    };

    $scope.$on('$viewContentLoaded', function() {
      console.info('tagitem $viewContentLoaded called');
    });

    $scope.$on('$destroy', function() {
      console.info('tagitem $destroy called');
    });

  }]);