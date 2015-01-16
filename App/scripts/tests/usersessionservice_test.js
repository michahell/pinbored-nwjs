
describe('user session service', function() {

  // service names
  var Usersessionservice, Utilservice, rootScope; //mockUtilService;

  // load module
  beforeEach(module('pinboredWebkitApp'));

  beforeEach(function() {
    // mockUtilService = {
    //   isEmpty: jasmine.createSpy()
    // };

    // // provide mock util service
    // module(function($provide) {
    //   $provide.value('Utilservice', mockUtilService);
    // });

    // inject required services
    inject(function($rootScope, _Usersessionservice_, _Utilservice_) {
      Usersessionservice = _Usersessionservice_;
      Utilservice = _Utilservice_;
      rootScope = $rootScope;
    });

    // spies
    spyOn(rootScope, '$broadcast');

  });
    
  it('should be able to instantiate', function() {
    expect(Usersessionservice).toBeDefined();
    expect(Utilservice).toBeDefined();
    expect(rootScope).toBeDefined();
  });

  it('should have the following functions', function() {
    expect(angular.isFunction(Usersessionservice.setAuthenticated)).toBe(true);
    expect(angular.isFunction(Usersessionservice.isAuthenticated)).toBe(true);
    expect(angular.isFunction(Usersessionservice.storeBookmarks)).toBe(true);
    expect(angular.isFunction(Usersessionservice.destroy)).toBe(true);
  });

  it('should set current page', function() {
    Usersessionservice.setCurrentSection(3);
    expect(rootScope.$broadcast).toHaveBeenCalledWith('user:pagechange', 3);
  });

  it('should by default not be authenticated', function() {
    expect(Usersessionservice.authenticated).toBe(false);
    expect(Usersessionservice.isAuthenticated()).toBe(false);
    expect(rootScope.$broadcast).toHaveBeenCalledWith('user:authenticated', false);
  });

  it('should authenticate', function() {
    var user = 'someuser', password = 'somepassword';
    Usersessionservice.setAuthenticated(user, password);
    expect(Usersessionservice.isAuthenticated()).toBe(true);
    expect(rootScope.$broadcast).toHaveBeenCalledWith('user:authenticated', true);
  });

});