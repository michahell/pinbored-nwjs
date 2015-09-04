
/**
 * @ngdoc filter
 * @name pinboredWebkitApp.fulltext
 * @description
 * # fulltext filter for BOOKMARKS
 * Filter in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .filter('bmFulltext', function() {
    return function(bookmarkCollection, word) {

      // console.log('full text filter invoked.');
      var filteredList = [];

      if(word !== undefined && word !== '' && word !== ' ') {
        if(word.length > 0) {
          for(var j=0; j<bookmarkCollection.length; j++) {
            var bookmark = bookmarkCollection[j];
            // var searchFields = [bookmark.extended, bookmark.description, bookmark.href, bookmark.tags];
            var searchFields = [bookmark.data.description];
            // search all searchFields
            for(var i=0; i<searchFields.length; i++) {
              var index = searchFields[i].toLowerCase().indexOf(word.toLowerCase());
              if (index > -1) {
                // set filtered to true and break
                filteredList.push(bookmark);
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
