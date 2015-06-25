
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Tagservice
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Tagservice', 
    ['$rootScope', '$filter', 'Pinboardservice', 'Appstatusservice', 'Usersessionservice', 'Utilservice', 
    function ($rootScope, $filter, Pinboardservice, Appstatusservice, Usersessionservice, Utilservice) {
    // AngularJS will instantiate a singleton by calling 'new' on this function




    // in memory cached tags
    this.storedTagData = {};

    this.storeTagData = function(pinboardData) {
      this.storedTagData = pinboardData;
    };




    // TAG SUPPORT FUNCTIONS




    this.loadTags = function() {
      return Pinboardservice.getAllTags();
    };

  }]);
