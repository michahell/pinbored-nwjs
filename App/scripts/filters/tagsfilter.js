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
      var filteredList = [];

      if(searchTags.length > 0) {

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

          for(var l=0; l<bookmarkCollection.length; l++) {
            var item2 = bookmarkCollection[l];
            var numMatched = 0;
            for(var m=0; m<searchTags.length; m++) {
              
              var searchTag2 = searchTags[m];
              var bookmarkTags2 = item2.data.tags.split(' ');
              for(var n=0; n<bookmarkTags2.length; n++) {
                if(bookmarkTags2[n] === searchTag2.text) {
                  numMatched++;
                }
              }

              if(numMatched === searchTags.length){
                filteredList.push(item2);
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
