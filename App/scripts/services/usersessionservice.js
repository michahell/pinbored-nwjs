
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Usersessionservice
 * @description
 * # Usersessionservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Usersessionservice', function Usersessionservice($rootScope, Utilservice) {

    // auth related
    this.connection = false;
    this.authenticated = false;
    this.user = '';
    this.apikey = '';

    // app session related
    this.currentSection = '';
    this.pageHistory = {
      overview : {},
      tags : {
        currentPage : null
      }
    };

    // temp ref
    var self = this;

    this.setCurrentSection = function(newCurrentSection) {
      this.currentSection = newCurrentSection;
      // notify listeners and provide the data that changed
      $rootScope.$broadcast('user:pagechange', this.currentSection);
    };

    this.setAuthenticated = function(username, apikey) {
      // return if no correct input is given
      if(Utilservice.isEmpty(username) || Utilservice.isEmpty(apikey)) { return; }
      // console.info('setAuthenticated: ' + username + ', ' + apikey);

      this.authenticated = true;
      this.user = username;
      this.apikey = apikey;

      // store user and apikey in HTML5 Web Storage (sessionStorage)
      sessionStorage.user = this.user;
      sessionStorage.apikey = this.apikey;

      // notify listeners and provide the data that changed
      $rootScope.$broadcast('user:authenticated', this.authenticated);
    };

    this.isAuthenticated = function() {

      // check if user and apikey are still in session storage.
      if(Utilservice.isEmpty(sessionStorage.user) || Utilservice.isEmpty(sessionStorage.apikey)) {
        this.authenticated = false;
      } else {
        // if they are, store them again in the service
        this.user = sessionStorage.user;
        this.apikey = sessionStorage.apikey;
        this.authenticated = true;
      }
      
      // notify listeners and provide the data that changed
      $rootScope.$broadcast('user:authenticated', this.authenticated);

      return this.authenticated;
    };

    this.destroy = function() {
      // destroy all session variables
      this.user = '';
      this.apikey = '';
      this.currentSection = '';

      // destroy in memory cached bookmarks
      this.storedBookmarks = {};

      // finally set authenticated to false
      this.authenticated = false;

      // notify listeners that user authentication changed
      $rootScope.$broadcast('user:authenticated', this.authenticated);
    };

  });
