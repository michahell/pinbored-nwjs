
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
    'ngResource',
    'ngSanitize',
    'ui.router',                  // angular ui router
    'ui.bootstrap',               // angular ui bootstrap
    'ct.ui.router.extras.core',   // angular ui bootstrap extras core
    'ct.ui.router.extras.sticky', // angular ui bootstrap extras sticky states
    'fui',                        // flat ui bootstrap
    'ngTagsInput',                // angular tags component
    'gridster',                   // gridster grid for tags screen
    'ngProgress',                 // angular animated progress bar
    'ngDialog',                   // angular dialog popup
    'nya.bootstrap.select',       // better select
    'monospaced.elastic'          // elastic textarea
  ])
  .config(function($stateProvider, $stickyStateProvider, $urlRouterProvider) {

    // $stickyStateProvider.enableDebug(true);

    // For any unmatched url, redirect to /overview
    $urlRouterProvider.otherwise("/overview");

    // Now set up the states
    $stateProvider

      .state('login', {
        url: '/login',
        sticky: true,
        views: {
          'login': {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl',
          }
        }
      })

      .state('overview', {
        url: '/overview',
        sticky: true,
        views: {
          'overview': {
            templateUrl: 'views/overview.html',
            controller: 'OverviewCtrl',
          }
        }
      })

      .state('tags', {
        url: '/tags',
        sticky: true,
        views: {
          'tags': {
            templateUrl: 'views/tags.html',
            controller: 'TagsCtrl',
          }
        }
      })

      .state('tools', {
        url: '/tools',
        sticky: true,
        views: {
          'tools': {
            templateUrl: 'views/tools.html',
            controller: 'ToolsCtrl',
          }
        }
      })

      .state('settings', {
        url: '/settings',
        sticky: true,
        views: {
          'settings': {
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl',
          }
        }
      });

  })

  .run(function ($rootScope, $state) {
    $rootScope.$state = $state;
  });