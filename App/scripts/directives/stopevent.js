
/**
 * @ngdoc directive
 * @name pinboredWebkitApp.stopEvent
 * @description
 * # stopEvent directive
 * Directive in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function (e) {
          e.stopPropagation();
        });
      }
    };
  });