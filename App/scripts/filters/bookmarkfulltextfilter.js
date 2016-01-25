
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

      // console.log('full text filter invoked.');
      var filteredList = [];
      var currentBookmark = null;
      var searchFields = ['extended', 'description', 'href', 'tags'];

      if(word !== undefined && word !== '' && word !== ' ') {
        if(word.length > 0) {
          for(var j=0; j<bookmarkCollection.length; j++) {
            currentBookmark = bookmarkCollection[j];
            // search all searchFields
            for(var i=0; i<searchFields.length; i++) {
              var index = currentBookmark[searchFields[i]].toLowerCase().indexOf(word.toLowerCase());
              if (index > -1) {
                // set filtered to true and break
                filteredList.push(currentBookmark);
                break;
              }
            }
          }
        }
      } else {
        // there is no word to filter on.
        return bookmarkCollection;
      }
      return filteredList;
    };
  });
