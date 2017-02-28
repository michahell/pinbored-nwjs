
/**
 * @ngdoc service
 * @name pinboredWebkitApp.services.Tagservice
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.services.
 */
angular.module('pinboredWebkitApp.services')
  .service('Tagservice', 
    ['$rootScope', '$filter', '$q', 'Pinboardservice', 'Appstatusservice', 
    'Usersessionservice', 'Utilservice', 
    function ($rootScope, $filter, $q, Pinboardservice, Appstatusservice, 
      Usersessionservice, Utilservice) {
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

    this.getTagByName = function(tagNameSearched) {
      
      var deferred = $q.defer();
      
      Pinboardservice.getAllTags()
      .then(function(tags) {
        var foundTag = {};
        _.each(tags, function(occurrences, tagname) {
          console.log(tagname, '===', tagNameSearched, ' ?');
          if(tagname === tagNameSearched) {
            foundTag = {
              'tagname' : tagname, 
              'occurrences' : occurrences
            };
            return;
          }
        });
        if(!_.isEmpty(foundTag)) {
          deferred.resolve(foundTag);
        } else {
          deferred.reject('pinboardservice :: could not find tag by name: ' + tagNameSearched);
        }
      })
      .catch(function(failreason) {
        console.error('Failed getting tag by name: ' + failreason);
      });

      return deferred.promise;
    };

  }]);
