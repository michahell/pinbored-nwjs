
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Utilservice
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Utilservice', function Utilservice($filter) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.isEmpty = function(input) {
      var result = true;
      if (input !== null && input !== undefined && input !== '' && input !== ' ') {
        result = false;
      }
      return result;
    };

    this.capitalize = function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    };

    this.removeItemFromCollection = function (byProperty, value, collection) {
      var deletedBookmark = $filter('searchcollection')(byProperty, value, collection);
      collection.splice(collection.indexOf(deletedBookmark), 1);
    };

  });
