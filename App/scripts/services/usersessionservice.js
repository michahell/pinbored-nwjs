'use strict';

/**
 * @ngdoc service
 * @name pinboredWebkitApp.Usersessionservice
 * @description
 * # Usersessionservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Usersessionservice', function Usersessionservice($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.isAuthenticated = false;
    this.apikey = '';

    this.authenticated = function() {
      this.isAuthenticated = true;
      // notify listeners and provide the data that changed [optional]
      $rootScope.$broadcast('user:authenticated', this.isAuthenticated);
    }

  });
