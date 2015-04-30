
/**
 * @ngdoc directive
 * @name pinboredWebkitApp.icheck
 * @description
 * # icheck directive
 * Directive in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .directive('icheck', function($timeout, $parse) {
      return {
          require: 'ngModel',
          link: function($scope, element, $attrs, ngModel) {
              return $timeout(function() {
                  var value = $attrs['value'];
                  $scope.$watch($attrs['ngModel'], function(newValue){
                      $(element).iCheck('update');
                  })

                  $scope.$watch($attrs['ngDisabled'], function(newValue) {
                      $(element).iCheck(newValue ? 'disable':'enable');
                      $(element).iCheck('update');
                  })

                  return $(element).iCheck({
                      checkboxClass: 'icheckbox_flat-green',
                      radioClass: 'iradio_flat-green'
                  }).on('ifToggled', function(event) {
                      if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                          $scope.$apply(function() {
                              return ngModel.$setViewValue(event.target.checked);
                          });
                      }
                      if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                          return $scope.$apply(function() {
                              return ngModel.$setViewValue(value);
                          });
                      }
                  });
              },300);
          }
      };
  })