
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainNavCtrl', function ($scope, Usersessionservice) {

    // page model
    $scope.data = {
      showNav : false,
      activePage : '',
      username : 'user',
      navItems : [
        {name: 'overview' },
        {name: 'tags' }
        // {name: 'tools' },
        // {name: 'statistics' },
        // {name: 'settings' }
      ]
    };

    // root scope listeners
    $scope.$on('user:authenticated', function() { // args: event, data
      if(Usersessionservice.authenticated === true) {
        $scope.showNav = true;
        $scope.data.username = Usersessionservice.user;
      } else if(Usersessionservice.authenticated === false) {
        $scope.showNav = false;
        return;
      }
    });

    $scope.$on('user:pagechange', function() { // args: event, currentPage
      $scope.activePage = Usersessionservice.currentPage;
    });

    $scope.logout = function() {
      // TODO logout
      console.log('logging out...');
      Usersessionservice.destroy();
      console.info('logged out.');
    };

    $scope.quit = function() {
      // TODO quit
      console.log('quitting...');
      $scope.logout();
      console.info('bye! see you next time.');
    };

  });