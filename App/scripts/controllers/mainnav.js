
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pinboredWebkitApp
 */
angular.module('pinboredWebkitApp')
  .controller('MainNavCtrl', 
    ['$scope', 'ngDialog', 'Usersessionservice', 
    function ($scope, ngDialog, Usersessionservice) {

    // page model
    $scope.data = {
      showNav : false,
      activeSection : '',
      username : 'user',
      navItems : [
        { name: 'overview' },
        { name: 'tags' },
        // { name: 'tools' },
        // { name: 'statistics' },
        { name: 'settings' }
      ],
      userMenuItems : [
        { name : 'about', action : 'about' },
        { name : 'log out', action : 'logout' }
      ],
      selectedUserMenuItem : null
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
      $scope.data.activeSection = Usersessionservice.currentSection;
    });

    $scope.doAction = function(action) {
      switch (action) {
        case 'about':   $scope.about();   break;
        case 'logout':  $scope.logout();  break;
        break;
      };
    };

    $scope.about = function() {
      console.log('about clicked...');
      ngDialog.open({ template: 'templates/aboutTemplate.html' });
    };

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

  }]);