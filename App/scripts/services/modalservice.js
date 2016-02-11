
/**
 * @ngdoc service
 * @name pinboredWebkitApp.services.Modalservice
 * @description
 * # Modalservice
 * Service in the pinboredWebkitApp.services.
 */
angular.module('pinboredWebkitApp.services')
  .service('Modalservice', 
  ['$q', 'Utilservice', 
  function ($q, Utilservice) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.alert = function (windowTitle, messageString) {

      var deferred = $q.defer();
      
      alert(messageString);
      console.log('confirmed!');
      
      // setTimeout for deferred.resolve because alerts return immediately.
      setTimeout(function(){
        deferred.resolve();
      }, 250);

      return deferred.promise;
    };

    this.confirm = function (windowTitle, messageString) {

      var deferred = $q.defer();
      var isConfirmed = confirm(messageString);

      if(isConfirmed) { 
        console.log('modal confirmed!');
        deferred.resolve();
      } else {
        console.log('modal declined!');
        deferred.reject();
      }

      return deferred.promise;
    };

  }]);
