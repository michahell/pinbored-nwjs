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
      start = parseInt(start, 10);
      return input.slice(start);
    };
  });