
/**
 * @ngdoc filter
 * @name pinboredWebkitApp.fulltext
 * @description
 * # fulltext filter for BOOKMARKS
 * Filter in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .filter('bookmarkFulltext', function() {
    return function(bookmarkCollection, word) {

      var filteredList = bookmarkCollection;
      var searchFields = ['extended', 'description', 'href', 'tags'];

      if(word !== undefined && word !== '' && word !== ' ' && word.length > 0) {
        filteredList = _.filter(bookmarkCollection, function(bm, bmKey) {
          var filtered = false;
          _.each(searchFields, function(sf) {
            if (bm.data[sf].toLowerCase().indexOf(word.toLowerCase()) > -1) {
              filtered = true;
              return;
            }
          });
          return filtered;
        });
      }
      
      return filteredList;
    };
  });
