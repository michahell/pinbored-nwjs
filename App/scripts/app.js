
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
    // 'ngRoute',
    'ngResource',
    'ngSanitize',
    'ui.router',              // angular ui router
    'ui.bootstrap',           // angular ui bootstrap
    'fui',                    // flat ui bootstrap
    'ngTagsInput',            // angular tags component
    'gridster',               // gridster grid for tags screen
    'ngProgress',             // angular animated progress bar
    'ngDialog',               // angular dialog popup
    'nya.bootstrap.select',   // better select
    // 'ramdangular',            // use functional - reactive pipelines!
    'monospaced.elastic'      // elastic textarea
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/overview");

    // Now set up the states
    $stateProvider
      .state('overview', {
        url: "/overview",
        templateUrl: "views/overview.html",
        controller: 'OverviewCtrl'
      })
      .state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        controller: 'LoginCtrl'
      })
      .state('tags', {
        url: "/tags",
        templateUrl: "views/tags.html",
        controller: 'TagsCtrl'
      })
      .state('settings', {
        url: "/settings",
        templateUrl: "views/settings.html",
        controller: 'SettingsCtrl'
      });
  });