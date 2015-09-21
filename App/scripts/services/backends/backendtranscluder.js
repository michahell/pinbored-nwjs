
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Backendtranscluder
 * @description
 * # Utilservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Backendtranscluder', ['$rootScope', '$filter', 'Appstatusservice', 
    'Usersessionservice', 'Utilservice', 'Constants', 
    function ($rootScope, $filter, Appstatusservice, 
      Usersessionservice, Utilservice, Constants) {
    // AngularJS will instantiate a singleton by calling 'new' on this function


    /*
    var bmdata = pinboardData[i];
    var bookMark = {
      status: {
        selected : false,
        showEdit : false,
        hasChanged : false,
        staleness : 'unknown'
      },
      data: bmdata
    };
    */

    // transcluders
    this.transcluders = ['Backendpinboard'];
    
    // temp self reference
    var _this = this;



    // BOOKMARK TRANSCLUSIONS FOR EACH BACKEND




    this.transclude = function(raw, forBackend) {
      console.log('transcluding bookmark data for each backend...');
      if(_.contains(_this.transcluders, forBackend)) {
        console.log('transcluding bookmark data for ' + forBackend);
        // TODO transclude bookmarkdata
      }
    };

  }]);
