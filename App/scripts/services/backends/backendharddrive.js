
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Backendharddrive
 * @description
 * # Backendharddrive
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Backendharddrive', 
    ['$q', '$timeout', 'Usersessionservice', 'Modalservice', 'Appstatusservice', 'Appconfigservice',
    function($q, $timeout, Usersessionservice, Modalservice, Appstatusservice, Appconfigservice) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    var _this = this;

    try {
      var request = require('fs');
      // var async = require('async');
      // var bluebird = require('bluebird');
    } catch (error) {
      console.error('error loading fs, async or bluebird: ' + error);
    }

    /* ====================== INTERNALS ======================= */

    this.handleRequestComplete = function(result, responsecode, deferred) {
      if (result instanceof Error) {
        console.error('Require: Error: ', result.message);
        deferred.reject(result.message);
      } else {
        
        var parsedresult;
        
        try {
          parsedresult = JSON.parse(result);
          deferred.resolve(parsedresult);

        } catch (exception) {
          // console.error('backendharddrive: failed to parse request result json: ' + exception);
          // console.error(exception);
          // console.info('failed to JSON parse result.');
          if(result.length > 0) {
            parsedresult = result.toLowerCase();
            // console.info('result exists.');
            if (responsecode !== null && responsecode) {
              // console.info('response object exists.');
              // console.info(responsecode);
              deferred.resolve(responsecode.statusCode);
            } else {
              deferred.resolve(parsedresult);
            }
          } else if (responsecode !== null && responsecode) {
            // console.info('response object exists.');
            deferred.resolve(responsecode.statusCode);
          }
        }
      }
    };

    this.executeStandardRequest = function(requestString, deferred, additionalOpts, optionalCompleteCallback) {
      
      var errorHandler = function (error) {
        Appstatusservice.resetProgress();
        console.warn(error);
        deferred.reject(error);
      };

      // start progress bar anyway!
      Appstatusservice.startProgress();

    };

    /* ==================== AUTHENTICATION ==================== */

    

    /* ====================== BOOKMARKS ======================= */

    this.getRecentBookmarks = function(amount, tags) {
      var deferred = $q.defer();
      console.log('backendharddrive: getting  ' + amount + ' recent bookmarks...');
      return deferred.promise;
    };

    this.getAllBookmarks = function() {
      var deferred = $q.defer();
      console.log('backendharddrive: getting all bookmarks...');
      return deferred.promise;
    };

    this.getBookmark = function() { // args: tags, url, date
      var deferred = $q.defer();
      console.log('backendharddrive: getting bookmark...');
      return deferred.promise;
    };

    this.deleteBookmark = function(bookmarkUrl) {
      var deferred = $q.defer();
      console.log('backendharddrive: deleting bookmark...');
      return deferred.promise;
    };

    this.updateBookmark = function(bookmark) {
      // only difference between adding and updating is the 'replace' parameter
      return this.addBookmark(bookmark, 'yes');
    };

    this.addBookmark = function(bookmark, replace) {
      var deferred = $q.defer();
      if(replace === 'yes') {
        console.log('backendharddrive: updating bookmark...');
      } else {
        console.log('backendharddrive: adding bookmark...');
        replace = 'no';
      } 
      return deferred.promise;
    };

    /* ================ TAGS RELATED REQUESTS ================= */

    this.getAllTags = function() {
      var deferred = $q.defer();
      console.log('backendharddrive: getting all tags...');
      return deferred.promise;
    };

    this.deleteTag = function(tagname) {
      var deferred = $q.defer();
      console.log('backendharddrive: deleting tag...');
      return deferred.promise;
    };

    this.renameTag = function(oldTagName, newTagName) {
      var deferred = $q.defer();
      console.log('backendharddrive: renaming tag...');
      return deferred.promise;
    };

    this.foldTag = function(oldTagName, newTagName) {
      return this.renameTag(oldTagName, newTagName);
    };

  }]);
