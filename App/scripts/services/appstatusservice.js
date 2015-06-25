
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Appstatusservice
 * @description
 * # Appstatusservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Appstatusservice', 
    ['$rootScope',
    function ($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.process = {
      text : '',
      progress : 0,
      total : 0,
      color : ''
    };

    this.updateStatus = function(text, progress, total, color) {
      
      // console.info('$scope.updateStatus: ' + message);
      
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
      $rootScope.$broadcast('app:statuschange', this.process);
    };

  }]);
