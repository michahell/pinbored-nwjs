
describe('pinboard service', function() {

  // service names
  var q, http, timeout, rootScope, 
      Usersessionservice, Utilservice, Pinboardservice;

  beforeEach(function() {

    // load modules
    module('pinboredWebkitApp.thirdparty');
    module('pinboredWebkitApp.shared');
    module('pinboredWebkitApp.controllers');
    module('pinboredWebkitApp.services');
    
    // inject required services
    inject(function($q, $http, $timeout, $rootScope, _Usersessionservice_, _Utilservice_, _Pinboardservice_) {
      q = $q;
      http = $http;
      timeout = $timeout;
      rootScope = $rootScope;
      Utilservice = _Utilservice_;
      Pinboardservice = _Pinboardservice_;
      Usersessionservice = _Usersessionservice_;
    });

  });
    
  it('should be able to instantiate', function() {
    expect(Utilservice).toBeDefined();
    expect(Pinboardservice).toBeDefined();
    expect(Usersessionservice).toBeDefined();
  });

  it('should have the following functions', function() {
    expect(angular.isFunction(Pinboardservice.setTimeout)).toBe(true);
    expect(angular.isFunction(Pinboardservice.getUserToken)).toBe(true);
    expect(angular.isFunction(Pinboardservice.getRecentBookmarks)).toBe(true);
    expect(angular.isFunction(Pinboardservice.getAllBookmarks)).toBe(true);
    expect(angular.isFunction(Pinboardservice.getBookmark)).toBe(true);
    expect(angular.isFunction(Pinboardservice.deleteBookmark)).toBe(true);
    expect(angular.isFunction(Pinboardservice.updateBookmark)).toBe(true);
    expect(angular.isFunction(Pinboardservice.addBookmark)).toBe(true);
    expect(angular.isFunction(Pinboardservice.getAllTags)).toBe(true);
    expect(angular.isFunction(Pinboardservice.deleteTag)).toBe(true);
    expect(angular.isFunction(Pinboardservice.checkUrl)).toBe(true);
  });

});