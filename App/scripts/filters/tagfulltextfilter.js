
/**
 * @ngdoc filter
 * @name pinboredWebkitApp.shared.fulltext
 * @description
 * # fulltext filter for BOOKMARKS
 * Filter in the pinboredWebkitApp.shared.
 */
angular.module('pinboredWebkitApp.shared')

  .filter('tagFulltext', function() {
    return function(tagCollection, word) {

      var filteredList = tagCollection;

      if(word !== undefined && word !== '' && word !== ' ' && word.length > 0) {        
        filteredList = _.filter(tagCollection, function(tag, tagKey) {
          if (tag.tagname.toLowerCase().includes(word.toLowerCase()) || tag.tagname === word) {
            return true;
          } else {
            return false;
          }
        });
      }

      return filteredList;
    };
  });
