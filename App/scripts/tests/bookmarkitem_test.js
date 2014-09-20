
describe('bookmark item controller', function() {

  // service names
  var Usersessionservice, Utilservice, Pinboardservice,
      q, http, timeout, location, rootScope, controller,
      bookmarkItemCtrl, scope;

  // load module
  beforeEach(module('pinboredWebkitApp'));

  beforeEach(function() {
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
      updateBookmark : function(bookmarkitem) {
        var deferred = q.defer();
        timeout(function() {
          deferred.resolve({
            result_code : 'done'
          });
          // rootScope.$digest();
          rootScope.$apply();
        }, 500);
        return deferred.promise;
      }
    };

    // mock parent scope
    rootScope.deleteBookmark = function() {};
    rootScope.checkMaxTags = function() {};
    rootScope.updateFiltersPaging = function() {};
    rootScope.cancelCurrentOperations = function() {};
    rootScope.staleCheckBookmark = function(bookmark) {};
    rootScope.updateStatus = function(bookmark) {};
    rootScope.confirm = function(text) {
      var deferred = q.defer();
      timeout(function() {
        deferred.resolve();
        // rootScope.$digest();
        rootScope.$apply();
      }, 500);
      return deferred.promise;
    };

    rootScope.config = {
      showTags : false
    };

    rootScope.filter = {
      tags : []
    };

    rootScope.data = {
      selectedItems : []
    };

    // mock current scope data
    scope.item = {
      data : {
        description : 'some description',
        extended : 'another great extended description',
        hash : 'asd91bd1n4202nv32zx978z',
        href : 'http://www.nu.nl/',
        meta : '3dcc15cc15ca21fds123g5sa15',
        shared : 'yes',
        tags : 'tag othertag anothertag',
        time : '2014-09-10T23:58:26Z',
        toread : 'yes'
      },
      status : {
        hasChanged : false,
        selected : false,
        showEdit : false,
        staleness : 'unknown'
      }
    };

    // Create the controller
    bookmarkItemCtrl = controller('BookmarkItemCtrl', {
      $scope : scope,
      Usersessionservice : Usersessionservice,
      Pinboardservice : Pinboardservice,
    });

    // rootscope spies
    spyOn(scope, 'staleCheckBookmark');
    spyOn(scope, 'deleteBookmark');
    spyOn(scope, 'cancelCurrentOperations');

    // service spies
    spyOn(Pinboardservice, 'updateBookmark').andCallThrough();

    // scope spies
    spyOn(scope, 'openEditing').andCallThrough();
    spyOn(scope, 'closeEditing').andCallThrough();
    spyOn(scope, 'mapToProxyValues').andCallThrough();
    spyOn(scope, 'addWatchers').andCallThrough();
    spyOn(scope, 'removeWatchers').andCallThrough();
    spyOn(scope, 'resetBookmark').andCallThrough();

  });

  it('should be able to instantiate...', inject(function() {
    expect(bookmarkItemCtrl).toBeDefined();
  }));

  it('should have the following functions', function() {
    expect(angular.isFunction(scope.checkTagHighlight)).toBe(true);
    expect(angular.isFunction(scope.update)).toBe(true);
    expect(angular.isFunction(scope.reset)).toBe(true);
    expect(angular.isFunction(scope.resetBookmark)).toBe(true);
    expect(angular.isFunction(scope.mapToProxyValues)).toBe(true);
    expect(angular.isFunction(scope.closeEditing)).toBe(true);
    expect(angular.isFunction(scope.openEditing)).toBe(true);
    expect(angular.isFunction(scope.currentItemChanged)).toBe(true);
    expect(angular.isFunction(scope.proxyChanged)).toBe(true);
    expect(angular.isFunction(scope.removeWatchers)).toBe(true);
    expect(angular.isFunction(scope.addWatchers)).toBe(true);
    expect(angular.isFunction(scope.toggleEdit)).toBe(true);
    expect(angular.isFunction(scope.getSharedDescription)).toBe(true);
    expect(angular.isFunction(scope.tagsToArray)).toBe(true);
    expect(angular.isFunction(scope.clickTag)).toBe(true);
    expect(angular.isFunction(scope.selectItem)).toBe(true);
    expect(angular.isFunction(scope.delete)).toBe(true);
    expect(angular.isFunction(scope.staleCheck)).toBe(true);
    expect(angular.isFunction(scope.openBookmark)).toBe(true);
  });

  it('should have these defaults', function() {
    expect(scope.itemcopy).toBe(null);
    expect(scope.itemWatcher).toBe(null);
    expect(scope.proxyWatcher).toBe(null);
    expect(scope.itemproxy.toread).toBe(false);
    expect(scope.itemproxy.shared).toBe(false);
  });

  xit('should highlight a tag', function() {
    // expect(scope.itemcopy).toBe(null);
    // pending();
  });

  it('should update the bookmark', function() {
    scope.item.status.hasChanged = true;
    scope.update();
    expect(Pinboardservice.updateBookmark).toHaveBeenCalled();
    timeout.flush();
    expect(scope.removeWatchers).toHaveBeenCalled();
    expect(scope.item.status.hasChanged).toBe(false);
  });

  it('should reset the bookmark', function() {
    // first copy the item
    scope.openEditing();
    // then modify the item
    scope.item.data.tags = '';
    scope.currentItemChanged();
    expect(scope.item.status.hasChanged).toBe(true);
    // then see if bookmark gets reset
    scope.resetBookmark();
    expect(scope.item.status.hasChanged).toBe(false);
  });

  it('should map proxy values', function() {
    scope.mapToProxyValues();
    expect(scope.item.data.shared).toBe('yes');
    expect(scope.item.data.toread).toBe('yes');
    expect(scope.itemproxy.shared).toBe(true);
    expect(scope.itemproxy.toread).toBe(true);
  });

  it('should close editing', function() {
    scope.closeEditing();
    expect(scope.removeWatchers).toHaveBeenCalled();
    expect(scope.resetBookmark).toHaveBeenCalled();
  });

  it('should open editing', function() {
    scope.openEditing();
    expect(scope.itemcopy).toEqual(scope.item);
    expect(scope.mapToProxyValues).toHaveBeenCalled();
    expect(scope.addWatchers).toHaveBeenCalled();
  });

  it('should detect changes asdasd', function() {
    
    scope.itemcopy = {
      data : {
        description : 'some description',
        extended : 'another great extended description',
        hash : 'asd91bd1n4202nv32zx978z',
        href : 'http://www.nu.nl/',
        meta : '3dcc15cc15ca21fds123g5sa15',
        shared : 'yes',
        tags : 'tag othertag anothertag',
        time : '2014-09-10T23:58:26Z',
        toread : 'yes'
      },
      status : {
        hasChanged : false,
        selected : false,
        showEdit : false,
        staleness : 'unknown'
      }
    };

    scope.currentItemChanged();
    expect(scope.item.status.hasChanged).toBe(false);

    scope.itemcopy.data.shared = 'no';
    scope.currentItemChanged();
    expect(scope.item.status.hasChanged).toBe(true);
  });

  it('should change proxies', function() {
    scope.proxyChanged();
    expect(scope.item.data.shared).toBe('no');
    expect(scope.item.data.toread).toBe('no');
  });

  it('should remove watchers', function() {
    scope.removeWatchers();
    expect(scope.itemWatcher).toBe(null);
    expect(scope.proxyWatcher).toBe(null);
  });

  it('should add watchers', function() {
    scope.addWatchers();
    expect(scope.itemWatcher).not.toBe(undefined);
    expect(scope.proxyWatcher).not.toBe(undefined);
  });

  it('should open and close editing', function() {
    scope.toggleEdit();
    expect(scope.cancelCurrentOperations).toHaveBeenCalled();
    expect(scope.openEditing).toHaveBeenCalled();
    expect(scope.item.status.showEdit).toBe(true);
    scope.toggleEdit();
    expect(scope.cancelCurrentOperations).toHaveBeenCalled();
    expect(scope.closeEditing).toHaveBeenCalled();
    expect(scope.item.status.showEdit).toBe(false);
  });

  it('should equal a \'shared\' description string', function() {
    expect(scope.getSharedDescription()).toBe('bookmark is public');
  });

  it('should return tags array', function() {
    expect(scope.tagsToArray().length).toBe(3);
    expect(scope.tagsToArray()).toContain('tag');
    expect(scope.tagsToArray()).toContain('othertag');
    expect(scope.tagsToArray()).toContain('anothertag');
  });

  it('should do stuff when tag clicked', function() {
    var tag = 'tag';
    scope.clickTag(tag);
  });

  it('should select and deselect a bookmark', function() {
    scope.selectItem();
    expect(scope.item.status.selected).toBe(true);
    expect(scope.data.selectedItems.length).toBe(1);
    scope.selectItem();
    expect(scope.item.status.selected).toBe(false);
    expect(scope.data.selectedItems.length).toBe(0);
  });

  it('should delete a bookmark', function() {
    scope.delete();
    // expect(scope.deleteBookmark).toHaveBeenCalled();
  });

  it('should stale check a bookmark', function() {
    scope.staleCheck();
    expect(scope.staleCheckBookmark).toHaveBeenCalled();
  });

  it('should open a bookmark externally', function() {
    scope.openBookmark();
  });

});
