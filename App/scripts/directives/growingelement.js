
/**
 * @ngdoc directive
 * @name pinboredWebkitApp.growingElement
 * @description
 * # growingElement directive
 * Directive in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .directive('growingElement', function() {
    return {
      restrict: 'AEC',
      // scope: false,
      link: function (scope, element, attr) {
        // scope.hiddenContentHeight = element.css('max-height');
        console.log('i`m getting created at least: ', element, $scope.hiddenContentHeight);
        // listen to elastic broadcast
        scope.$on('elastic:resize', function(event, textarea, oldHeight, newHeight) {
          // var heightDiff = newHeight - oldHeight;
          // var realNewHeight = Number(element.css('max-height').replace('px', '')) + heightDiff;
          // console.log('realNewHeight: ', realNewHeight);
          // element.css({'max-height': realNewHeight + 'px'});
          // scope.hiddenContentHeight = realNewHeight;
        });
      }
    };
  });