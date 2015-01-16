
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
    // 'ngCookies',
    // 'ngResource',
    'ngRoute',
    'ngSanitize',
    // 'ngTouch',
    'ngTagsInput',
    'ui.bootstrap',
    'ui.splash',
    'angular-bootstrap-select',
    'angular-bootstrap-select.extra',
    'gridster'
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
      .when('/tools', {
        // templateUrl: 'views/tools.html',
        // controller: 'ToolsCtrl'
        redirectTo: '/'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  });