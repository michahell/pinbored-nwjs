
describe('util service', function() {

  // service names
  var Utilservice, $filter;

  beforeEach(function() {

    // load module
    module('pinboredWebkitApp.shared');
    module('pinboredWebkitApp.services');

    // inject required services
    inject(function(_Utilservice_, _$filter_) {
      Utilservice = _Utilservice_;
      $filter = _$filter_;
    });
  });

  it('should be able to instantiate', function() {
    expect(Utilservice).toBeDefined();
  });

  it('should have the following functions', function() {
    expect(angular.isFunction(Utilservice.objectSize)).toBe(true);
    expect(angular.isFunction(Utilservice.objectSize)).toBe(true);
  });

  it('should capitalize', function() {
    expect(Utilservice.capitalize('someString')).toBe('SomeString');
  });

  it('should return an object length of 2', function() {
    expect(Utilservice.objectSize({ test: 1, test2: 2 })).toBe(2);
  });
  
});