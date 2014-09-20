
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Modalservice
 * @description
 * # Modalservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Modalservice', function Modalservice($q, $splash, Utilservice) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.alert = function (windowTitle, messageString) {

      var deferred = $q.defer();

      var modalInstance = $splash.open({
        title: windowTitle || 'alert',
        message: messageString
      }, {
        templateUrl: 'templates/modal-alert-content.html',
        windowTemplateUrl: 'templates/modal-alert-index.html'
      });

      modalInstance.result
        .then(function() {
          deferred.resolve();
        }, function() {
          deferred.reject();
        });

      return deferred.promise;
    };

    this.confirm = function (windowTitle, messageString) {

      var deferred = $q.defer();

      var modalInstance = $splash.open({
        title: !Utilservice.isEmpty(windowTitle) ? windowTitle : 'Are you sure',
        message: messageString
      }, {
        templateUrl: 'templates/modal-confirm-content.html',
        windowTemplateUrl: 'templates/modal-confirm-index.html'
      });

      modalInstance.result
        .then(function() {
          deferred.resolve();
        }, function() {
          deferred.reject();
        });

      return deferred.promise;
    };

  });
