
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
      maxTagSearch : 4,
      // default values
      maxRecentItems : 50,
      itemsPerPage : 10,
      staleCheckTimeout : 5000,  // in ms
      defaultTimeout : 15000, // in ms
      // choosable amounts of defaults
      maxRecentAmounts : [10, 25, 50, 100],
      itemsPerPageAmounts : [10, 15, 20, 25, 30, 40, 50],
      staleCheckTimeoutAmounts : [2, 3, 4, 5, 10, 15, 20]
    };

    this.setConfig = function(configName, configValue) {
      var self = this;
      // set config
      if(configName !== undefined && configName !== null && configValue !== undefined && configValue !== null) {
        console.info('setting config name: ' + configName, configValue);
        self.config[configName] = configValue;
        // notify listeners and provide the current config
        $rootScope.$broadcast('app:configchange', self.config);
      }
    };

    this.setConfigObject = function(configObject) {
      var self = this;
      var valueChanged = false;
      // set config object
      console.log('appconfigservice: setting new configobject.');
      _.each(configObject, function(value, key) {
        if(_.contains(Object.keys(self.config), key)) {
          // console.info(key, 'exists in: ', Object.keys(self.config));
          if(self.config[key] !== configObject[key]) {
            console.info('setting config name: ' + key, value);
            valueChanged = true;
            self.config[key] = configObject[key];
          }
        }
      });
      if(valueChanged) {
        console.log('sending broadcast update...');
        // notify listeners and provide the current config
        $rootScope.$broadcast('app:configchange', self.config);
      }
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

    this.fixBackspace = function () {
      $(document).on('keydown', function (e) {
        if (e.which === 8 && !$(e.target).is("input, textarea")) {
          e.preventDefault();
        }
      });
    };

    this.fixQuirks = function() {
      this.fixBackspace();
      console.info('app config :: quirks fixed!');
    };

    this.fixQuirks();

  }]);
