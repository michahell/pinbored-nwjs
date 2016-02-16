
/**
 * @ngdoc value
 * @name pinboredWebkitApp.Events
 * @description
 * # Events
 * Constant in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp.shared')
  .constant('Events', {
    app : {
      statusupdate : 'app:statusupdate',
      configchanged : 'app:configchanged'
    },
    batch : {
      start : 'batch:start',                      // indicates a batch process started
      alltagsremoved : 'batch:alltagsremoved',
      alltagsfolded : 'batch:alltagsfolded',
      end : 'batch:end'                           // indicates a batch process ended
    },
    bm : {
      create : 'bookmark:created',
      update : 'bookmark:updated',
      delete : 'bookmark:deleted'
    },
    tag : {
      create : 'tag:created',
      update : 'tag:updated',
      delete : 'tag:deleted'
    }
  });
