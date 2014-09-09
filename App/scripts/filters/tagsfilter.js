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

        if(logicType === 'OR') {

          for(var i=0; i<bookmarkCollection.length; i++) {
            var item = bookmarkCollection[i];
            var matches = false;
            for(var j=0; j<searchTags.length; j++) {
              if(matches === false) {
                var searchTag = searchTags[j];
                var bookmarkTags = item.data.tags.split(' ');
                for(var k=0; k<bookmarkTags.length; k++) {
                  if(bookmarkTags[k] === searchTag.text) {
                    filteredList.push(item);
                    matches = true;
                    break;
                  }
                }
              } else {
                break;
              }
            }
          }

        } else if(logicType === 'AND') {

          for(var i=0; i<bookmarkCollection.length; i++) {
            var item = bookmarkCollection[i];
            var numMatched = 0;
            for(var j=0; j<searchTags.length; j++) {
              
              var searchTag = searchTags[j];
              var bookmarkTags = item.data.tags.split(' ');
              for(var k=0; k<bookmarkTags.length; k++) {
                if(bookmarkTags[k] === searchTag.text) {
                  numMatched++;
                }
              }

              if(numMatched === searchTags.length){
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
