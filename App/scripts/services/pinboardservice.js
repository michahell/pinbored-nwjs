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

    try {
      var rest = require('restler');
    } catch (error) {
      console.error('error loading restler: ' + error);
    }

    this.handleRestler = function(result, deferred) {
      if (result instanceof Error) {
        console.error('Restler: Error: ', result.message);
        deferred.reject(result.message);
      } else {
        var parsedresult;
        try {
          parsedresult = JSON.parse(result);
          deferred.resolve(parsedresult);
        } catch (exception) {
          console.error("Pinboardservice: failed to parse request result json: " + exception);
          console.error(exception);
          parsedresult = result.toLowerCase();
          deferred.reject(parsedresult);
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
      rest.get(request).on('complete', function(result) {
        this.handleRestler(result, deferred);
      });
      
      return deferred.promise;
    }

    this.getRecentBookmarks = function(amount, tags) {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) return;

      console.log('pinboardservice: getting  ' + amount + ' recent bookmarks...')

      var deferred = $q.defer();
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
      rest.get(request).on('complete', function(result) {
        self.handleRestler(result, deferred);
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
      rest.get(request).on('complete', function(result) {
        self.handleRestler(result, deferred);
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
      rest.get(request).on('complete', function(result) {
        self.handleRestler(result, deferred);
      });
      
      return deferred.promise;
    }

  });
