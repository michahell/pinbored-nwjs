
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Bookmarkservice
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Bookmarkservice', function Bookmarkservice() {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.isEmpty = function(input) {
      var result = true;
      if (input !== null && input !== undefined && input !== '' && input !== ' ') {
        result = false;
      }
      return result;
    };

  });
