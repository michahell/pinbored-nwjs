
/**
 * @ngdoc filter
 * @name pinboredWebkitApp.fulltext
 * @description
 * # fulltext filter for BOOKMARKS
 * Filter in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .filter('tagFulltext', function() {
    return function(tagCollection, word) {

      // console.log('full text filter invoked.');
      var filteredList = [];
      var currentTag = null;

      if(word !== undefined && word !== '' && word !== ' ') {
        if(word.length > 0) {
          for(var j=0; j<tagCollection.length; j++) {
            currentTag = tagCollection[j];
            var index = currentTag.tagname.toLowerCase().indexOf(word.toLowerCase());
            if (index > -1) {
              // set filtered to true and break
              filteredList.push(currentTag);
              break;
            }
          }
        }
      } else {
        // there is no word to filter on.
        return tagCollection;
      }
      return filteredList;
    };
  });
