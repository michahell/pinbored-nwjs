'use strict';

/**
 * @ngdoc directive
 * @name pinboredWebkitApp.btnLoading
 * @description
 * # btnLoading directive
 * Directive in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .directive("btnLoading", function(){
    return function(scope, element, attrs){
      scope.$watch(function(){ return scope.$eval(attrs.btnLoading); }, function(loading){
        // if(loading) return element.button("loading");
        // element.button("reset");
      });
    };
  });