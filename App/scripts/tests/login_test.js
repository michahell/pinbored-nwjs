
describe('login controller', function() {

  // service names
  var Usersessionservice, Utilservice, Pinboardservice,
      q, http, timeout, location, rootScope, controller,
      loginCtrl, scope;

  // load module
  beforeEach(module('pinboredWebkitApp'));

  beforeEach(function() {
    // inject required services
    inject(function($q, $http, $timeout, $location, $rootScope, $controller, _Usersessionservice_, _Utilservice_, _Pinboardservice_) {
      q = $q;
      http = $http;
      timeout = $timeout;
      location = $location;
      rootScope = $rootScope;
      controller = $controller;
      Utilservice = _Utilservice_;
      Usersessionservice = _Usersessionservice_;
      Pinboardservice = _Pinboardservice_;
      scope = rootScope.$new();
    });

    // Create the controller
    loginCtrl = controller('LoginCtrl', {
      $scope : scope,
      Usersessionservice : Usersessionservice,
      Pinboardservice : Pinboardservice,
      $location : location,
      $timeout : timeout
    });

    // spies
    spyOn(scope, 'login');
    spyOn(Pinboardservice, 'getUserToken');

  });

  it('should be able to instantiate...', inject(function() {
    expect(loginCtrl).toBeDefined();
  }));

  it('should have these defaults', function() {
    expect(scope.busy).toBe(false);
    expect(scope.loginAnimation).toBe(null);
  });

  it('should call login() on enter keypress', function() {
    var keyEvent = {which : 13};
    scope.loginEnter(keyEvent);
    expect(scope.login).toHaveBeenCalled();
  });

  // it('should not login', function() {
  //   var user = 'someuser', password = 'somepassword';
  //   scope.login(user, password);
  //   expect(Pinboardservice.getUserToken).toHaveBeenCalledWith(user, password);
  //   expect(scope.loginAnimation).toBe(false);
  // });

});
