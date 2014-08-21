'use strict';

/**
 * @ngdoc service
 * @name pinboredWebkitApp.Pinboardservice
 * @description
 * # Pinboardservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Pinboardservice', function Pinboardservice($q, $http, Usersessionservice) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.authstring = 'https://user:password@api.pinboard.in/v1/';
    this.endpoint = 'https://api.pinboard.in/v1/';
    this.format = '?format=json';
    this.token = '&auth_token=user:apikey';

    var self = this;

    try {
      var rest = require('restler');
    } catch (error) {
      console.error('error loading restler: ' + error);
    }

    this.handleRestler = function(result, responsecode, deferred) {
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

    this.getUserToken = function(username, password) {
      
      console.log('pinboardservice: getting user token...')

      var deferred = $q.defer();
      // modify url to include username + password,  user:password. See https://pinboard.in/api/ under authentication
      var authstringReplaced = this.authstring.replace('user', username).replace('password', password);
      // request API token for session duration
      var request = authstringReplaced + 'user/api_token' + this.format;

      // node restler stuff
      rest.get(request).on('complete', function(result, response) {
        self.handleRestler(result, response, deferred);
      });
      
      return deferred.promise;
    }

    this.getRecentBookmarks = function(amount, tags) {

      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
        // setTimeout(function(){
        //   deferred.reject();
        // }, 200);
        return deferred.promise;
      }

      console.log('pinboardservice: getting  ' + amount + ' recent bookmarks...')

      var argAmount, argTags;
      var self = this;

      if(amount === null || amount <= 0)  argAmount = 15;
      else                                argAmount = "&count=" + amount;

      if(tags === null || tags === undefined) argTags = "";
      else                                    argTags = "&tag=" + tags;
      
      // create request
      var request = this.endpoint + 'posts/recent' + this.format + argAmount + argTags + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // node restler stuff
      rest.get(request).on('complete', function(result, response) {
        self.handleRestler(result, response, deferred);
      });
      
      return deferred.promise;
    }

    this.getAllBookmarks = function() {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) return;

      console.log('pinboardservice: getting all bookmarks...')

      var deferred = $q.defer();
      var self = this;

      // create request
      var request = this.endpoint + 'posts/all' + this.format + argTags + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // node restler stuff
      rest.get(request).on('complete', function(result, response) {
        self.handleRestler(result, response, deferred);
      });
      
      return deferred.promise;
    }

    this.getAllTags = function() {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) return;

      console.log('pinboardservice: getting all tags...')

      var deferred = $q.defer();
      var self = this;

      // create request
      var request = this.endpoint + 'tags/get' + this.format + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      console.info(request);
      
      // node restler stuff
      rest.get(request).on('complete', function(result, response) {
        self.handleRestler(result, response, deferred);
      });
      
      return deferred.promise;
    }

    this.checkUrl = function(url) {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) return;

      console.log('pinboardservice: performing stale request...')

      var deferred = $q.defer();
      var self = this;

      // node restler simplest request ever
      rest.get(url).on('success', function(result, response) {
        self.handleRestler(result, response, deferred);
      });
      
      return deferred.promise;
    }

  });
