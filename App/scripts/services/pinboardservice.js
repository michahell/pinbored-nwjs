'use strict';

/**
 * @ngdoc service
 * @name pinboredWebkitApp.Pinboardservice
 * @description
 * # Pinboardservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Pinboardservice', function Pinboardservice($q, $http, $timeout, Usersessionservice) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.authstring = 'https://user:password@api.pinboard.in/v1/';
    this.endpoint = 'https://api.pinboard.in/v1/';
    this.format = '?format=json';
    this.token = '&auth_token=user:apikey';
    this.timeout = 5000;

    var self = this;

    try {
      var rest = require('restler');
    } catch (error) {
      console.error('error loading restler: ' + error);
    }

    /* ====================== INTERNALS ======================= */

    this.setTimeout = function(newMilliSeconds) {
      this.timeout = newMilliSeconds;
    }

    this.handleRestlerComplete = function(result, responsecode, deferred) {
      if (result instanceof Error) {
        console.error('Restler: Error: ', result.message);
        deferred.reject(result.message);
      } else {
        
        var parsedresult;
        
        try {
          parsedresult = JSON.parse(result);
          deferred.resolve(parsedresult);

        } catch (exception) {
          // console.error("Pinboardservice: failed to parse request result json: " + exception);
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
    }

    /* ==================== AUTHENTICATION ==================== */

    this.getUserToken = function(username, password) {
      
      console.log('pinboardservice: getting user token...')

      var deferred = $q.defer();
      // modify url to include username + password,  user:password. See https://pinboard.in/api/ under authentication
      var authstringReplaced = this.authstring.replace('user', username).replace('password', password);
      // request API token for session duration
      var request = authstringReplaced + 'user/api_token' + this.format;

      // node restler handler
      rest.get(request, {timeout: self.timeout}).on('timeout', function(ms){
        console.error('pinboardservice: request timed out.');
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        self.handleRestlerComplete(result, response, deferred);
      });
      
      return deferred.promise;
    }

    /* ====================== BOOKMARKS ======================= */

    this.getRecentBookmarks = function(amount, tags) {

      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
          $timeout(function() {
            deferred.reject('pinboardservice: user not authenticated.');
          }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: getting  ' + amount + ' recent bookmarks...')
      
      var argAmount, argTags;

      if(amount === null || amount <= 0)  argAmount = 15;
      else                                argAmount = "&count=" + amount;

      if(tags === null || tags === undefined) argTags = "";
      else                                    argTags = "&tag=" + tags;
      
      // create request
      var request = this.endpoint + 'posts/recent' + this.format + argAmount + argTags + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // node restler handler
      rest.get(request, {timeout: self.timeout}).on('timeout', function(ms){
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        self.handleRestlerComplete(result, response, deferred);
      });
      
      return deferred.promise;
    }

    this.getAllBookmarks = function() {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
          $timeout(function() {
            deferred.reject('pinboardservice: user not authenticated.');
          }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: getting all bookmarks...')

      var deferred = $q.defer();

      // create request
      var request = this.endpoint + 'posts/all' + this.format + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // node restler handler
      rest.get(request, {timeout: self.timeout}).on('timeout', function(ms){
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        self.handleRestlerComplete(result, response, deferred);
      });
      
      return deferred.promise;
    }

    this.getBookmark = function(tags, url, date) {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
          $timeout(function() {
            deferred.reject('pinboardservice: user not authenticated.');
          }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: getting bookmark...')

      var deferred = $q.defer();

      'posts/get'

      // mock retrieve bookmark

      return deferred.promise;
    }

    this.deleteBookmark = function(bookmarkUrl) {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
          $timeout(function() {
            deferred.reject('pinboardservice: user not authenticated.');
          }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: deleting bookmark...')

      var deferred = $q.defer();

      // create request
      var url = '&url=' + encodeURIComponent(bookmarkUrl);
      var request = this.endpoint + 'posts/delete' + this.format + url + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      console.log('request');
      console.log(request);

      // node restler handler
      rest.get(request, {timeout: self.timeout}).on('timeout', function(ms){
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        self.handleRestlerComplete(result, response, deferred);
      });

      return deferred.promise;

    }

    this.updateBookmark = function(bookmark) {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
          $timeout(function() {
            deferred.reject('pinboardservice: user not authenticated.');
          }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: updating bookmark...')
      
      var deferred = $q.defer();

      'posts/add'

      // mock delete bookmark
      deferred.resolve(bookmark.data.hash);

      return deferred.promise;
    }

    /* ================ TAGS RELATED REQUESTS ================= */

    this.getAllTags = function() {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
          $timeout(function() {
            deferred.reject('pinboardservice: user not authenticated.');
          }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: getting all tags...')

      var deferred = $q.defer();

      // create request
      var request = this.endpoint + 'tags/get' + this.format + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      console.info(request);
      
      // node restler handler
      rest.get(request, {timeout: self.timeout}).on('timeout', function(ms){
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        self.handleRestlerComplete(result, response, deferred);
      });
      
      return deferred.promise;
    }

    this.deleteTag = function(tag) {
      'tags/delete'
    }

    /* =================== CUSTOM REQUESTS ==================== */

    this.checkUrl = function(url) {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
          $timeout(function() {
            deferred.reject('pinboardservice: user not authenticated.');
          }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: performing stale request...')

      var deferred = $q.defer();

      // node restler handler
      rest.get(url, {timeout: self.timeout}).on('timeout', function(ms){
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        self.handleRestlerComplete(result, response, deferred);
      });
      
      return deferred.promise;
    }

  });
