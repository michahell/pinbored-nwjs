
describe('pinboredWebkitApp:Utilservice', function() {

  // load module
  beforeEach(module('pinboredWebkitApp'));

  describe('Utilservice', function() {

    it('should be able to instantiate...', inject(function(_Utilservice_) {
      var utilservice = _Utilservice_;
      expect(utilservice).toBeDefined();
    }));

  });
});