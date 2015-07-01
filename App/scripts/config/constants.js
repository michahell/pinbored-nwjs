
/**
 * @ngdoc value
 * @name pinboredWebkitApp.Constants
 * @description
 * # Constants
 * Constant in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .constant('Constants', {
    events : {
      app : {
        statusupdate : 'app:statusupdate'
      },
      batch : {
        start : 'batch:start',                      // indicates a batch process started
        delete : 'batch:deleted',
        tagremoved : 'batch:tagremoved',
        tagadded : 'batch:tagadded',
        alltagsremoved : 'batch:alltagsremoved',
        alltagsfolded : 'batch:alltagsfolded',
        end : 'batch:end'                           // indicates a batch process ended
      },
      bm : {
        // create : 'bookmark:created',
        update : 'bookmark:updated',
        delete : 'bookmark:deleted'
      },
      tag : {
        // create : 'tag:created',
        update : 'tag:updated',
        delete : 'tag:deleted'
      }
    }
  });
