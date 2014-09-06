'use strict';

/**
 * @ngdoc filter
 * @name pinboredWebkitApp.offset
 * @description
 * # offset filter
 * Filter in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .filter('offset', function() {
    return function(input, start) {

      // console.log("offset filter invoked.");
      if(input !== undefined && input !== null && input.length > 0) {
        start = parseInt(start, 10);
        return input.slice(start);
      }
    };
  });