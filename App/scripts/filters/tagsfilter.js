'use strict';

/**
 * @ngdoc filter
 * @name pinboredWebkitApp.tags
 * @description
 * # tags filter
 * Filter in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')

  .filter('tags', function() {
    return function(bookmarkCollection, searchTags, logicType) {

      // console.log('tags filter invoked.');

      if(searchTags.length > 0) {
        var filteredList = [];
        for(var i=0; i<bookmarkCollection.length; i++) {
          var item = bookmarkCollection[i];
          for(var j=0; j<searchTags.length; j++) {
            var searchTag = searchTags[j];
            var bookmarkTags = item.data.tags.split(' ');
            for(var k=0; k<bookmarkTags.length; k++) {
              if(bookmarkTags[k] === searchTag.text) {
                filteredList.push(item);
                break;
              }
            }
          }
        }
      } else {
        return bookmarkCollection;
      }
      return filteredList;
    };
  });
