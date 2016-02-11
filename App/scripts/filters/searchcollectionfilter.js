
/**
 * @ngdoc filter
 * @name pinboredWebkitApp.shared.searchcollection
 * @description
 * # searchcollection filter
 * Filter in the pinboredWebkitApp.shared.
 */
angular.module('pinboredWebkitApp.shared')
  
  .filter('searchcollection', function() {
    return function(propertyName, propertyValue, collection) {
      var i=0, len=collection.length;
      for (; i<len; i++) {
        // console.log(collection[i].data[propertyName]);
        if (collection[i].data[propertyName] === propertyValue) {
          return collection[i];
        }
      }
      return null;
    };
  });