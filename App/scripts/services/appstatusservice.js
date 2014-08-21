'use strict';

/**
 * @ngdoc service
 * @name pinboredWebkitApp.Appstatusservice
 * @description
 * # Appstatusservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Appstatusservice', function Appstatusservice($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.process = {
      text : '',
      progress : 0,
      total : 0
    }

    this.updateCurrentProcess = function(text, progress, total) {
      
      this.process.text = text;
      this.process.progress = progress;
      this.process.total = total;

      // notify listeners and provide the current status
      $rootScope.$broadcast('app:statuschange', this.process);
    }

  });
