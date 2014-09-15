
describe('util service', function() {

  // load module
  beforeEach(module('pinboredWebkitApp'));

  it('should be able to instantiate', inject(function(_Utilservice_) {
    var utilservice = _Utilservice_;
    expect(utilservice).toBeDefined();
  }));

  it('should be empty', inject(function(_Utilservice_) {
    var utilservice = _Utilservice_;
    expect(utilservice.isEmpty('')).toBe(true);
    expect(utilservice.isEmpty(' ')).toBe(true);
    expect(utilservice.isEmpty(null)).toBe(true);
    expect(utilservice.isEmpty(undefined)).toBe(true);

    // pending
    // expect(utilservice.isEmpty({})).toBe(true);
    // expect(utilservice.isEmpty([])).toBe(true);
  }));
  
});