'use strict';

/**
 * @ngdoc service
 * @name pinboredWebkitApp.Pinboardservice
 * @description
 * # Pinboardservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Pinboardservice', function Pinboardservice($q, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.initendpoint = 'https://user:password@api.pinboard.in/v1/';
    this.endpoint = 'https://api.pinboard.in/v1/';
    this.format = '?format=json';
    this.apikey = '';

    try {
      var rest = require('restler');
    } catch (error) {
      console.error('error loading restler: ' + error);
    }

    this.getUserToken = function(username, password) {

      var deferred = $q.defer();

      // modify url to include username + password,  user:password. 
      // See https://pinboard.in/api/ under authentication
      this.initendpoint = this.initendpoint.replace('user', username).replace('password', password);

      // request API token for session duration
      this.request = this.initendpoint + 'user/api_token' + this.format;

      console.log('init endpoint: ' + this.initendpoint);
      console.log('this.request: ' + this.request);
      
      // node restler stuff
      rest.get(this.request).on('complete', function(result) {
        if (result instanceof Error) {
          console.log('Error:', result.message);
          deferred.reject('Pinboard token request failed: ', result.message);
        // this.retry(5000); // try again after 5 sec
        } else {
          console.log(result);
          deferred.resolve(data);
        }
      });
      
      return deferred.promise;
    }

  });
