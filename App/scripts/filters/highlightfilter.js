'use strict';

/**
 * @ngdoc filter
 * @name pinboredWebkitApp.highlight
 * @description
 * # highlight filter
 * Filter in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) {
        text = text.replace(new RegExp('('+phrase+')', 'gi'), '<span class="highlight-search">$1</span>');
      }
      return $sce.trustAsHtml(text);
    };
  });