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

    this.getUserToken = function(username, password) {
      var deferred = $q.defer();
      // modify url to include username + password,  user:password. See https://pinboard.in/api/ under authentication
      var authstringReplaced = this.authstring.replace('user', username).replace('password', password);
      // request API token for session duration
      var request = authstringReplaced + 'user/api_token' + this.format;

      // node restler stuff
      rest.get(request).on('complete', function(result) {
        deferred.resolve(result);
        // if (result instanceof Error) {
        //   console.log('Error:', result.message);
        //   deferred.reject('Pinboard token request failed: ', result.message);
        // // this.retry(5000); // try again after 5 sec
        // } else {
        //   console.log(result);
        //   deferred.resolve(data);
        // }
      });
      
      return deferred.promise;
    }

    this.getRecentBookmarks = function(amount, tags) {

      // check if authenticated
      if(!Usersessionservice.isAuthenticated) {
        console.error("not authenticated!");
        return;
      }

      console.info("requesting " + amount + " bookmarks...");

      var deferred = $q.defer();
      var argAmount, argTags;

      if(amount === null || amount <= 0)  argAmount = 15;
      else                                argAmount = "&count=" + amount;

      if(tags === null || tags === undefined) argTags = "";
      else                                    argTags = "&tag=" + tags;
      
      // create request
      var request = this.endpoint + 'posts/recent' + this.format + argAmount + argTags + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // node restler stuff
      rest.get(request).on('complete', function(result) {
        
        if (result instanceof Error) {
          console.error('Restler: Error: ', result.message);
          deferred.reject(result.message);
        } else {
          var parsedresult;
          try {
            parsedresult = JSON.parse(result);
            deferred.resolve(parsedresult);
          } catch (exception) {
            console.error("Pinboardservice: failed to parse request result json.");
            parsedresult = result.toLowerCase();
            deferred.reject(parsedresult);
          }
        }

      });
      
      return deferred.promise;
    }

  });
