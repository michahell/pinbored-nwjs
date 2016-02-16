
describe('login controller', function() {

  // service names
  var Usersessionservice, Utilservice, Pinboardservice,
      q, http, timeout, location, rootScope, controller,
      loginCtrl, scope;

  beforeEach(function() {

    // load modules
    module('pinboredWebkitApp.thirdparty');
    module('pinboredWebkitApp.shared');
    module('pinboredWebkitApp.controllers');
    module('pinboredWebkitApp.services');

    // inject required services
    inject(function($q, $http, $timeout, $location, $rootScope, $controller, _Usersessionservice_, _Utilservice_) {
      q = $q;
      http = $http;
      timeout = $timeout;
      location = $location;
      rootScope = $rootScope;
      controller = $controller;
      Utilservice = _Utilservice_;
      Usersessionservice = _Usersessionservice_;
      scope = rootScope.$new();
    });

    // mock pinboard service
    Pinboardservice = {
      setTimeout : function() {},
      handleRestlerComplete : function() {},
      getUserToken : function() {},
      getRecentBookmarks : function() {},
      getAllBookmarks : function() {},
      getBookmark : function() {},
      deleteBookmark : function() {},
      updateBookmark : function(bookmarkitem) {},
      addBookmark : function() {},
      getAllTags : function() {},
      deleteTag : function() {},
      checkUrl : function() {}
    };

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
    expect(scope.model.busy).toBe(false);
    expect(scope.model.loginAnimation).toBe(null);
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
