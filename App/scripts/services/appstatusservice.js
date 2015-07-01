
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Appstatusservice
 * @description
 * # Appstatusservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Appstatusservice', 
    ['$rootScope', 'ngProgress', 'Constants', 'Config', 
    function ($rootScope, ngProgress, Constants, Config) {
    // AngularJS will instantiate a singleton by calling "new" on this function

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
      $rootScope.$broadcast(Constants.events.app.statusupdate, this.process);
    };

    this.startProgress = function() {
      ngProgress.start();
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
    };

    this.completeProgress = function() {
      ngProgress.complete();
    };

  }]);
