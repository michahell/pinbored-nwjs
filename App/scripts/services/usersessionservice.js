'use strict';

/**
 * @ngdoc service
 * @name pinboredWebkitApp.Usersessionservice
 * @description
 * # Usersessionservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Usersessionservice', function Usersessionservice() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.isAuthenticated = false;

    this.setAuthenticated = function(setAuth) {
      if (setAuth == true) {
        this.isAuthenticated = true;
      } else if (setAuth == false) {
        this.isAuthenticated = false;
      }
    }

  });
