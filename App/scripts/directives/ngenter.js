
/**
 * @ngdoc directive
 * @name pinboredWebkitApp.ngEnter
 * @description
 * # ngEnter directive
 * Directive in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.ngEnter);
          });

          event.preventDefault();
        }
      });
    };
  });