'use strict';

/**
 * @ngdoc service
 * @name pinboredWebkitApp.Utilservice
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Utilservice', function Utilservice() {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.isEmpty = function(input) {
      var result = true;
      if (input !== null && input !== undefined && input !== '' && input !== ' ') {
        result = false;
      }
      return result;
    };

  });
