
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Appconfigservice
 * @description
 * # Appconfigservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Appconfigservice', 
    ['$rootScope', 
    function ($rootScope) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.config = {
      maxRecentItems : 50,
      maxRecentAmounts : [10, 25, 50, 100],
      maxTagSearch : 4,
      itemsPerPage : 10,
      itemsPerPageAmounts : [10, 15, 20, 25, 30, 40, 50]
    };

    this.setConfig = function(configName, configValue) {
      var self = this;
      // set config
      if(configName !== undefined && configName !== null && configValue !== undefined && configValue !== null) {
        console.info('setting config name: ' + configName, configValue);
        self.config[configName] = configValue;
      }
      // notify listeners and provide the current config
      $rootScope.$broadcast('app:configchange', this.config);
    };

    this.getConfig = function(configName) {
      var self = this;
      // get config or null
      if(configName !== undefined && configName !== null) {
        console.info('getting config name: ' + configName);
        return self.config[configName];
      } else {
        // called without arguments, returns complete config obj.
        return self.config;
      }
    };

  }]);
