
/**
 * @ngdoc service
 * @name pinboredWebkitApp.services.Tagservice
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.services.
 */
angular.module('pinboredWebkitApp.services')
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
