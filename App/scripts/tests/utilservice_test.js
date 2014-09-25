
describe('util service', function() {

  // service names
  var Utilservice, $filter;

  // load module
  beforeEach(module('pinboredWebkitApp'));

  beforeEach(function() {
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
    expect(angular.isFunction(Utilservice.capitalize)).toBe(true);
    expect(angular.isFunction(Utilservice.removeItemFromCollection)).toBe(true);
    expect(angular.isFunction(Utilservice.isEmpty)).toBe(true);
  });

  it('should be empty', function() {
    expect(Utilservice.isEmpty('')).toBe(true);
    expect(Utilservice.isEmpty(' ')).toBe(true);
    expect(Utilservice.isEmpty(null)).toBe(true);
    expect(Utilservice.isEmpty(undefined)).toBe(true);

    // pending
    // expect(Utilservice.isEmpty({})).toBe(true);
    // expect(Utilservice.isEmpty([])).toBe(true);
  });

  it('should capitalize', function() {
    expect(Utilservice.capitalize('someString')).toBe('SomeString');
  });

  it('should find any item in any collection', function() {
    var list = [
      { data : { name : 'stringOne' } },
      { data : { name : 'stringTwo' } },
      { data : { name : 'stringThree' } }
    ];
    var foundItem = Utilservice.findItemInCollection(name, 'stringOne', list);
    expect(foundItem).toBe({ data : { name : 'stringOne' } });
  });

  it('should remove any item from any collection', function() {
    var list = [
      { data : { name : 'stringOne' } },
      { data : { name : 'stringTwo' } },
      { data : { name : 'stringThree' } }
    ];
    Utilservice.removeItemFromCollection(name, 'stringTwo', list);
    expect(list.length).toBe(2);
    expect(list).toContain({ data : { name : 'stringOne' } });
    expect(list).toContain({ data : { name : 'stringThree' } });
  });
  
});