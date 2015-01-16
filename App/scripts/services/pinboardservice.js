
/**
 * @ngdoc service
 * @name pinboredWebkitApp.Pinboardservice
 * @description
 * # Pinboardservice
 * Service in the pinboredWebkitApp.
 */
angular.module('pinboredWebkitApp')
  .service('Pinboardservice', function Pinboardservice($q, $http, $timeout, Usersessionservice, Modalservice) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.authstring = 'https://user:password@api.pinboard.in/v1/';
    this.endpoint = 'https://api.pinboard.in/v1/';
    this.format = '?format=json';
    this.token = '&auth_token=user:apikey';
    this.timeout = 5000;

    var self = this;

    try {
      var rest = require('restler');
      var dns = require('dns');
    } catch (error) {
      console.error('error loading restler / dns: ' + error);
    }

    /* ====================== INTERNALS ======================= */

    this.checkConnection = function() {

      console.log('pinboardservice: checking connection...');

      var deferred = $q.defer();

      dns.resolve('www.google.com', function(err) {
        if (err) {
          // no connection
          Usersessionservice.connection = false;
          deferred.reject(err);
        } else {
          // connection
          Usersessionservice.connection = true;
          deferred.resolve();
        }
      });

      return deferred.promise;
    };

    this.setTimeout = function(newMilliSeconds) {
      this.timeout = newMilliSeconds;
    };

    this.handleRestlerComplete = function(result, responsecode, deferred) {
      if (result instanceof Error) {
        console.error('Restler: Error: ', result.message);
        deferred.reject(result.message);
      } else {
        
        var parsedresult;
        
        try {
          parsedresult = JSON.parse(result);
          deferred.resolve(parsedresult);

        } catch (exception) {
          // console.error('Pinboardservice: failed to parse request result json: ' + exception);
          // console.error(exception);
          // console.info('failed to JSON parse result.');
          if(result.length > 0) {
            parsedresult = result.toLowerCase();
            // console.info('result exists.');
            if (responsecode !== null && responsecode) {
              // console.info('response object exists.');
              // console.info(responsecode);
              deferred.resolve(responsecode.statusCode);
            } else {
              deferred.resolve(parsedresult);
            }
          } else if (responsecode !== null && responsecode) {
            // console.info('response object exists.');
            deferred.resolve(responsecode.statusCode);
          }
        }
      }
    };

    this.executeStandardRequest = function(request, deferred) {
      // node restler handler
      rest.get(request, {timeout: self.timeout}).on('timeout', function(){ // arg: ms
        console.error('pinboardservice: request timed out.');
        // show modal expressing error
        Modalservice.alert('error', 'request timed out');
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        self.handleRestlerComplete(result, response, deferred);
      });
    };

    /* ==================== AUTHENTICATION ==================== */

    this.getUserToken = function(username, password) {
      
      console.log('pinboardservice: getting user token...');

      var deferred = $q.defer();
      // modify url to include username + password,  user:password. See https://pinboard.in/api/ under authentication
      var authstringReplaced = this.authstring.replace('user', username).replace('password', password);
      // request API token for session duration
      var request = authstringReplaced + 'user/api_token' + this.format;

      // execute standard request
      self.executeStandardRequest(request, deferred);

      return deferred.promise;
    };

    /* ====================== BOOKMARKS ======================= */

    this.getRecentBookmarks = function(amount, tags) {

      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
        $timeout(function() {
          deferred.reject('pinboardservice: user not authenticated.');
        }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: getting  ' + amount + ' recent bookmarks...');
      
      var argAmount, argTags;

      if(amount === null || amount <= 0)  { argAmount = 15; }
      else                                { argAmount = '&count=' + amount; }

      if(tags === null || tags === undefined) { argTags = ''; }
      else                                    { argTags = '&tag=' + tags; }
      
      // create request
      var request = this.endpoint + 'posts/recent' + this.format + argAmount + argTags + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // node restler handler
      rest.get(request, {timeout: self.timeout}).on('timeout', function(){ // arg: ms
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        // we only need the posts part. for some reason this is not the same result sent as in
        // get all bookmarks. probably there is metadata.
        var posts = JSON.stringify(JSON.parse(result).posts);
        self.handleRestlerComplete(posts, response, deferred);
      });
      
      return deferred.promise;
    };

    this.getAllBookmarks = function() {

      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
        $timeout(function() {
          deferred.reject('pinboardservice: user not authenticated.');
        }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: getting all bookmarks...');

      // create request
      var request = this.endpoint + 'posts/all' + this.format + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // execute standard request
      self.executeStandardRequest(request, deferred);
      
      return deferred.promise;
    };

    this.getBookmark = function() { // args: tags, url, date

      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
        $timeout(function() {
          deferred.reject('pinboardservice: user not authenticated.');
        }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: getting bookmark...');

      // 'posts/get'

      // mock retrieve bookmark

      return deferred.promise;
    };

    this.deleteBookmark = function(bookmarkUrl) {

      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
        $timeout(function() {
          deferred.reject('pinboardservice: user not authenticated.');
        }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: deleting bookmark...');

      // create request
      var url = '&url=' + encodeURIComponent(bookmarkUrl);
      var request = this.endpoint + 'posts/delete' + this.format + url + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // execute standard request
      self.executeStandardRequest(request, deferred);

      return deferred.promise;

    };

    this.updateBookmark = function(bookmark) {
      // only difference between adding and updating is the 'replace' parameter
      var promise = this.addBookmark(bookmark, 'yes');
      return promise;
    };

    this.addBookmark = function(bookmark, replace) {
      
      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
        $timeout(function() {
          deferred.reject('pinboardservice: user not authenticated.');
        }, 100);
        return deferred.promise;
      }

      if(replace === 'yes') {
        console.log('pinboardservice: updating bookmark...');
      } else {
        console.log('pinboardservice: adding bookmark...');
        replace = 'no';
      } 
      
      // create request
      var url = '&url=' + encodeURIComponent(bookmark.data.href);
      var description = '&description=' + encodeURIComponent(bookmark.data.description);
      var extended = '&extended=' + encodeURIComponent(bookmark.data.extended);
      var tags = '&tags=' + encodeURIComponent(bookmark.data.tags);
      var replacement = '&replace=' + replace;
      var shared = '&shared=' + bookmark.data.shared;
      var toread = '&toread=' + bookmark.data.toread;

      var request = this.endpoint + 'posts/add' + this.format + url + description + 
      extended + tags + replacement + shared + toread + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // execute standard request
      self.executeStandardRequest(request, deferred);

      return deferred.promise;
    };

    /* ================ TAGS RELATED REQUESTS ================= */

    this.getAllTags = function() {

      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
        $timeout(function() {
          deferred.reject('pinboardservice: user not authenticated.');
        }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: getting all tags...');

      // create request
      var request = this.endpoint + 'tags/get' + this.format + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // execute standard request
      self.executeStandardRequest(request, deferred);
      
      return deferred.promise;
    };

    this.deleteTag = function() { // arg: tag
      // 'tags/delete'
      console.warn('DELETE TAG CALLED : IMPLEMENTATION NEEDED!');
    };

    /* =================== CUSTOM REQUESTS ==================== */

    this.checkUrl = function(url) {

      var deferred = $q.defer();

      // check if authenticated
      if(!Usersessionservice.isAuthenticated()) {
        $timeout(function() {
          deferred.reject('pinboardservice: user not authenticated.');
        }, 100);
        return deferred.promise;
      }

      console.log('pinboardservice: performing stale request...');

      // node restler handler
      rest.get(url, {timeout: self.timeout}).on('timeout', function(){ // arg: ms
        deferred.reject('pinboardservice: request timed out.');
      }).on('complete', function(result, response){
        self.handleRestlerComplete(result, response, deferred);
      });
      
      return deferred.promise;
    };

  });
