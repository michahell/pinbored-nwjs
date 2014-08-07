'use strict';

/**
 * @ngdoc service
 * @name pinboredWebkitApp.Usersessionservice
 * @description
 * # Usersessionservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Usersessionservice', function Usersessionservice($rootScope, $cookies, Utilservice) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var gui = require('nw.gui');
    var win = gui.Window.get();

    this.authenticated = false;
    this.user = '';
    this.apikey = '';

    this.setAuthenticated = function(username, apikey) {
      // return if no correct input is given
      if(Utilservice.isEmpty(username) || Utilservice.isEmpty(apikey)) return;
      // console.info('setAuthenticated: ' + username + ', ' + apikey);

      this.authenticated = true;
      this.user = username;
      this.apikey = apikey;

      // store user and apikey in HTML5 Web Storage (sessionStorage)
      sessionStorage.user = this.user;
      sessionStorage.apikey = this.apikey;

      // notify listeners and provide the data that changed
      $rootScope.$broadcast('user:authenticated', this.authenticated);
    }

    this.isAuthenticated = function() {
      // check if user and apikey are still in session storage
      if(Utilservice.isEmpty(sessionStorage.user) || Utilservice.isEmpty(sessionStorage.apikey)) return;

      // if they are store them again in the service
      this.user = sessionStorage.user;
      this.apikey = sessionStorage.apikey;
      // console.info(this.user, this.apikey);

      this.authenticated = true;
      // notify listeners and provide the data that changed
      $rootScope.$broadcast('user:authenticated', this.authenticated);
    }

  });
