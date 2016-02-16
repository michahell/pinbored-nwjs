
/**
 * @ngdoc overview
 * @name pinboredWebkitApp
 * @description
 * # pinboredWebkitApp
 *
 * Main module of the application.
 */

angular.module('pinboredWebkitApp.shared', []);
angular.module('pinboredWebkitApp.services', []);
angular.module('pinboredWebkitApp.controllers', []);

angular.module('pinboredWebkitApp.thirdparty', [
  'ngAnimate',
  'ngSanitize',
  'ui.bootstrap',               // angular ui bootstrap
  'fui',                        // flat ui bootstrap
  'ngTagsInput',                // angular tags component
  'gridster',                   // gridster grid for tags screen
  'ngProgress',                 // angular animated progress bar
  'ngDialog',                   // angular dialog popup
  'monospaced.elastic'          // elastic textarea
]);

angular.module('pinboredWebkitApp', [
    'ui.router',                  // angular ui router
    'ct.ui.router.extras.core',   // angular ui bootstrap extras core
    'ct.ui.router.extras.sticky', // angular ui bootstrap extras sticky states

    'pinboredWebkitApp.thirdparty',   // depend on third party shite module
    'pinboredWebkitApp.shared',       // depend on shared stuff module
    'pinboredWebkitApp.services',     // depend on separate services module
    'pinboredWebkitApp.controllers'   // depend on separate controllers module
  ])
  .config(function($stateProvider, $stickyStateProvider, $urlRouterProvider) {

    // $stickyStateProvider.enableDebug(true);

    // For any unmatched url, redirect to /overview
    $urlRouterProvider.otherwise("/login");

    // Now set up the states
    $stateProvider

      .state('login', {
        url: '/login',
        sticky: true,
        views: {
          'login': {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
          }
        }
      })

      .state('overview', {
        url: '/overview',
        sticky: true,
        views: {
          'overview': {
            templateUrl: 'views/overview.html',
            controller: 'OverviewCtrl'
          }
        }
      })

      .state('tags', {
        url: '/tags',
        sticky: true,
        views: {
          'tags': {
            templateUrl: 'views/tags.html',
            controller: 'TagsCtrl'
          }
        }
      })

      .state('tools', {
        url: '/tools',
        sticky: true,
        views: {
          'tools': {
            templateUrl: 'views/tools.html',
            controller: 'ToolsCtrl'
          }
        }
      })

      .state('settings', {
        url: '/settings',
        sticky: true,
        views: {
          'settings': {
            templateUrl: 'views/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })

      .state('about', {
        url: '/about',
        sticky: true,
        views: {
          'about': {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
          }
        }
      });

  })

  .run(function ($rootScope, $state) {
    $rootScope.$state = $state;
  });