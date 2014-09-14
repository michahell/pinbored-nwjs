
describe('pinboredWebkitApp:Usersessionservice', function() {

  // service names
  var mockUtilService, $rootScope;

  // load module
  beforeEach(module('pinboredWebkitApp'));

  beforeEach(function() {
    mockUtilService = {
      setData: jasmine.createSpy(), 
      abort: jasmine.createSpy()
    };

    // provide mock util service
    module(function($provide) {
      $provide.value('Utilservice', mockUtilService);
    });

    // inject required services
    inject(function($rootScope) {
      $rootScope = $rootScope;
    });

  });

  describe('Usersessionservice', function() {
    
    it('should be able to instantiate...', inject(function(_Usersessionservice_) {
      var usersessionservice = _Usersessionservice_;
      expect(usersessionservice).toBeDefined();
    }));

    // it('should have an getAllSections function', function () {
    //     expect(angular.isFunction($dataService.getAllSections)).toBe(true);
    // });

  });
});