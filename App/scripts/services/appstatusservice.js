
/**
 * @ngdoc service
 * @name pinboredWebkitApp.services.Appstatusservice
 * @description
 * # Appstatusservice
 * Service in the pinboredWebkitApp.services.
 */
angular.module('pinboredWebkitApp.services')
  .service('Appstatusservice', 
    ['$rootScope', 'ngProgress', 'Events', 'Config', 
    function ($rootScope, ngProgress, Events, Config) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.state = {
      hasPendingOperations: false,
      numPendingOperations: 0
    };

    this.process = {
      text : '',
      progress : 0,
      total : 0,
      color : ''
    };

    // configure ngProgress
    ngProgress.height(Config.theme.progressbar.height);
    ngProgress.color(Config.theme.progressbar.color);

    this.updateStatus = function(text, progress, total, color) {
      
      if(progress === undefined || progress === null || total === undefined || total === null) {
        progress = 0;
        total = 0;
      }

      if(color === undefined || color === null) {
        color = 'info';
      }

      this.process.text = text;
      this.process.progress = progress;
      this.process.total = total;
      this.process.color = color;

      // notify listeners and provide the current status
      $rootScope.$broadcast(Events.app.statusupdate, this.process);
    };

    this.startProgress = function() {
      ngProgress.start();
      this.state.hasPendingOperations = true;
      this.state.numPendingOperations++;
    };

    this.updateProgress = function(progress, total) {
      // update ngProgress bar
      if(progress !== 0 && total !== 0 && progress !== null && total !== null) {
        ngProgress.start();
        if(progress !== total) {
          ngProgress.set(progress/total);
        } else if(progress === total) {
          ngProgress.complete();
        }
      } else {
        ngProgress.complete();
      }
    };

    this.resetProgress = function() {
      ngProgress.reset();
      if (this.state.numPendingOperations > 0) {
        this.state.numPendingOperations--;
      }
    };

    this.hasNoPendingOperationsIfZero = function() {
      if (this.state.numPendingOperations === 0) {
        this.state.hasPendingOperations = false;
      }
    };

    this.completeProgress = function() {
      ngProgress.complete();
      if (this.state.numPendingOperations > 0) {
        this.state.numPendingOperations--;
      }
      this.hasNoPendingOperationsIfZero();
    };

    this.hasPendingOperations = function () {
      return (this.state.hasPendingOperations) ? this.state.pendingOperations : false;
    };

  }]);
