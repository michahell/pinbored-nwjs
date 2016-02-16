
/**
 * @ngdoc service
 * @name pinboredWebkitApp.services.Utilservice
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.services.
 */
angular.module('pinboredWebkitApp.services')
  .service('Utilservice', 
    ['$filter', 
    function ($filter) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.objectSize = function(object) {
      return Object.keys(object).length;
    };

    this.capitalize = function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    };

  }]);
