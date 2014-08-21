'use strict';

/**
 * @ngdoc directive
 * @name pinboredWebkitApp.btnLoading
 * @description
 * # btnLoading directive
 * Directive in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .directive("flatuiRadio", function() {
    return {
      restrict: "AE",
      template: '<label ng-class="{\'checked\': model == value, \'disabled\': disabled}" class="radio">{{label}}<span class="icons"><span class="first-icon fui-radio-unchecked"></span><span class="second-icon fui-radio-checked"></span></span><input type="radio" ng-model="model" ng-disabled="disabled" ng-value="value" ng-required="required" name="name"/></label>',
      replace: true,
      scope: {
          model: "=",
          label: "=",
          value: "=",
          required: "=",
          name: "=",
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

  .directive("flatuiCheckbox", function() {
    return {
      restrict: "AE",
      template: '<label ng-class="{\'checked\': model, \'disabled\': disabled}" class="checkbox">{{label}}<span class="icons"><span class="first-icon fui-checkbox-unchecked"></span><span class="second-icon fui-checkbox-checked"></span></span><input type="checkbox" ng-model="model" ng-disabled="disabled" ng-value="value" ng-required="required" name="name"/></label>',
      replace: true,
      scope: {
        model: "=",
        label: "=",
        value: "=",
        required: "=",
        name: "=",
        disabled: "@"
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
      template: '<div ng-click="model = disabled && model || !disabled && !model" ng-class="{\'deactivate\': disabled, \'switch-square\': square}" class="switch has-switch"><div ng-class="{\'switch-off\': !model, \'switch-on\': model}" class="switch-animate"><span ng-bind="onLabel" class="switch-left"></span><label>&nbsp</label><span ng-bind="offLabel" class="switch-right"></span></div></div>',
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
  })

  .directive('flatuiSelect', function($parse) {
    return {
      restrict: 'EA',
      replace: false,
      transclude : false,
      template: ' ' + 
      '<div class="flatui-select-container">' +
        '<select name="herolist" value="" class="select-block" style="display: none;" ng-transclude>' +
        '</select>' +
        '<div class="btn-group select select-block">' +
          '<button class="btn dropdown-toggle clearfix btn-primary btn-xs" data-toggle="dropdown">' +
            '<span class="filter-option pull-left">most recent</span>&nbsp;<span class="caret"></span>' +
          '</button>' +
          '<span class="dropdown-arrow dropdown-arrow-inverse"></span>' +
          '<ul class="dropdown-menu dropdown-inverse" role="menu" style="max-height: 100px; overflow-y: auto; min-height: 50px;">' +
            '<li rel="2"><a tabindex="-1" href="javascript: void(0)" class=""><span class="pull-left">all bookmarks</span></a></li>' +
            '<li rel="4" class="selected"><a tabindex="-1" href="javascript: void(0)" class=""><span class="pull-left">most recent</span></a></li>' +
          '</ul>' +
        '</div>' +
      '</div>',
      compile: function(element, attrs) {
        var modelAccessor = $parse(attrs.ngModel);
        // element.selectpicker({style: 'btn-primary', menuStyle: 'dropdown-inverse'});

        return function (scope, element, attrs, controller) {

        }
      }
    };
  });


