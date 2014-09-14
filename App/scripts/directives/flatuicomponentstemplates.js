'use strict';

/**
 * @ngdoc directive
 * @name pinboredWebkitApp.btnLoading
 * @description
 * # btnLoading directive
 * Directive in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .directive('flatuiRadio', function() {
    return {
      restrict: 'AE',
      templateUrl: 'templates/radiobutton.html',
      replace: true,
      scope: {
          model: '=',
          label: '=',
          value: '=',
          required: '=',
          name: '=',
          disabled: '@'
      },
      compile: function(element, attrs) {
          if (attrs.disabled === void 0) {
              attrs.disabled = false;
          } else {
              attrs.disabled = true;
          }
      }
    };
  })

  .directive('flatuiCheckbox', function() {
    return {
      restrict: 'AE',
      templateUrl: 'templates/checkbox.html',
      replace: true,
      scope: {
        model: '=',
        label: '=',
        value: '=',
        required: '=',
        name: '=',
        disabled: '@'
      },
      compile: function(element, attrs) {
        if (attrs.disabled === void 0) {
          attrs.disabled = false;
        } else {
          attrs.disabled = true;
        }
      }
    };
  })

  .directive('flatuiSwitch', function() {
    return {
      restrict: 'AE',
      templateUrl: 'templates/switch.html',
      replace: true,
      scope: {
        model: '=',
        disabled: '@',
        square: '@',
        onLabel: '@',
        offLabel: '@'
      },
      compile: function(element, attrs) {
        if (attrs.onLabel === void 0) {
          attrs.onLabel = 'ON';
        }
        if (attrs.offLabel === void 0) {
          attrs.offLabel = 'OFF';
        }
        if (attrs.disabled === void 0) {
          attrs.disabled = false;
        } else {
          attrs.disabled = true;
        }
        if (attrs.square === void 0) {
          attrs.square = false;
        } else {
          attrs.square = true;
        }
      }
    };
  });
