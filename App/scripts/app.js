
/**
 * @ngdoc overview
 * @name pinboredWebkitApp
 * @description
 * # pinboredWebkitApp
 *
 * Main module of the application.
 */
angular
  .module('pinboredWebkitApp', [
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ngTagsInput',            // angular tags component
    'ui.bootstrap',           // angular ui bootstrap
    'fui',                    // flat ui bootstrap
    'gridster',               // gridster grid for tags screen
    'ngProgress',             // angular animated progress bar
    'ngDialog',               // angular dialog popup
    'nya.bootstrap.select',   // better select
    'ramdangular',            // use functional - reactive pipelines!
    'monospaced.elastic'      // elastic textarea
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/overview.html',
        controller: 'OverviewCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/overview', {
        templateUrl: 'views/overview.html',
        controller: 'OverviewCtrl'
      })
      .when('/tags', {
        templateUrl: 'views/tags.html',
        controller: 'TagsCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      });
  });