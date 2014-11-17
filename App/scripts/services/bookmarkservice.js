
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Bookmarkservice
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Bookmarkservice', function Bookmarkservice(Pinboardservice, Appstatusservice, 
    Usersessionservice, Utilservice) {
    // AngularJS will instantiate a singleton by calling 'new' on this function




    // in memory cached bookmarks
    this.storedBookmarkData = {};

    this.storeBookmarkData = function(pinboardData) {
      self.storedBookmarkData = pinboardData;
    };




    // bookmark support functions




    this.loadBookmarks = function(loadType, args) {
      if(loadType === 'recent') { 
        // get recent bookmarks
        return Pinboardservice.getRecentBookmarks(args);
      }
      if(loadType === 'all') { 
        // get all bookmarks
        return Pinboardservice.getAllBookmarks(args);
      }
    };

    this.createBookmarkObjects = function(pinboardData) {
      var bookmarks = [];

      for(var i=0; i<pinboardData.length; i++) {
        var bmdata = pinboardData[i];
        var bookMark = {
          status: {
            selected : false,
            showEdit : false,
            hasChanged : false,
            staleness : 'unknown'
          },
          data: bmdata
        };
        bookmarks.push(bookMark);
      }

      // cache bookmarks in usersession
      this.storeBookmarkData(pinboardData);

      // and return bookmark objects
      return bookmarks;
    };

    


    // BATCH SELECTION SUPPORT FUNCTIONS




    this.selectionAddTag = function(newTagName, selection) {
      var total = selection.length;
      var updated = 0;
      console.log('bookmarks to add tags to: ' + total);

      if(selection.length > 0) {
        for(var i=0; i<selection.length; i++) {
          // following is inside anonymous function closure because of loop iterator scope problem
          (function(i, newTagName){
            // set initial status to checking
            selection[i].data.tags += ' ' + newTagName;
            // update bookmark
            Pinboardservice.updateBookmark(selection[i])
            .then(function(result) {
              // var updatedBmHash = $scope.data.selectedItems[i]['data']['hash'];
              var updatedBmHash = selection[i].data.hash;
              updated++;
              if(result.result_code === 'done') {
                Appstatusservice.updateStatus('updated bookmark: ' + updatedBmHash + '.', updated, total);
              } else {
                Appstatusservice.updateStatus('Failed: ' + result.result_code + '.', updated, total, 'danger');
              }
            }, function(reason) {
              Appstatusservice.updateStatus('Failed: ' + reason, updated, total, 'danger');
            });
          })(i, newTagName);
        }
      }
    };

    this.selectionDeleteAllTags = function(selection) {
      var total = selection.length;
      var updated = 0;
      console.log('bookmarks to delete all tags from: ' + total);

      // delete all tagsfunction.
      var deleteTagsFromNextBookmark = function(i) {
        if(selection.length > 0 && updated !== total) {
          // remove all tags from bookmark
          selection[i].data.tags = '';
          Pinboardservice.updateBookmark(selection[i])
          .then(function(result) {
            if(result.result_code === 'done') {
              // var updatedBmHash = $scope.data.selectedItems[i]['data']['hash'];
              var updatedBmHash = selection[i].data.hash;
              updated++;
              Appstatusservice.updateStatus('updated bookmark: ' + updatedBmHash + '.', updated, total);
              // recursively delete all tags on next bookmark
              if(selection.length > 0 && updated !== total) {
                deleteTagsFromNextBookmark(i+1);
              }
            } else {
              Appstatusservice.updateStatus('Failed: ' + result.result_code + '.', updated, total, 'danger');
            }
          }, function(reason) {
            Appstatusservice.updateStatus('Failed: ' + reason, updated, total, 'danger');
          });
        } else {
          Appstatusservice.updateStatus('done deleting all tags from all selected bookmarks.');
        }
      };

      deleteTagsFromNextBookmark(0);
    };




    // INDIVIDUAL BOOKMARK SUPPORT ACTIONS




    this.deleteBookmark = function (bookmarkItem, collection) {
      var responseFailed = function(message) {
        Appstatusservice.updateStatus('Failed to delete bookmark: ' + message + '.', 0, 0, 'danger');
      };

      Pinboardservice.deleteBookmark(bookmarkItem.data.href)
        .then(function(result) {
          if(result.result_code === 'done') {
            console.log('delete request completed.');
            Utilservice.removeItemFromCollection('hash', bookmarkItem.data.hash, collection);
            Appstatusservice.updateStatus('deleted bookmark, hash: ' + bookmarkItem.data.hash + '.');
          } else {
            responseFailed(result);
          }
        }, function(reason) {
          responseFailed(reason);
        });
    };

    this.staleCheckBookmark = function(bookmark) {
      bookmark.status.staleness = 'checking';
      Pinboardservice.checkUrl(bookmark.data.href)
      .then(function(result) {
        if(result === 200) {
          console.info('bookmarkitem healthy! ' + result);
          bookmark.status.staleness = 'healthy';
        } else {
          console.info('bookmarkitem STALE! ' + result);
          bookmark.status.staleness = 'dead';
        }
      }, function(reason) {
        console.info('bookmarkitem STALE! ' + reason);
        bookmark.status.staleness = 'dead';
      });
    };

  });
