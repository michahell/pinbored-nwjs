
/**
 * @ngdoc filter
 * @name pinboredWebkitApp.shared.highlight
 * @description
 * # highlight filter
 * Filter in the pinboredWebkitApp.shared.
 */
angular.module('pinboredWebkitApp.shared')

  .filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) {
        text = text.replace(new RegExp('('+phrase+')', 'gi'), '<span class="highlight-search">$1</span>');
      }
      return $sce.trustAsHtml(text);
    };
  });