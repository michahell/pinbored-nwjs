
/**
 * @ngdoc service
 * @name pinboredWebkitApp.services.Pinboardservice
 * @description
 * # Pinboardservice
 * Service in the pinboredWebkitApp.services.
 */

var request = require('request');
var progress = require('request-progress');
var https = require('https');
var dns = require('dns');
    
angular.module('pinboredWebkitApp.services')
  .service('Pinboardservice', 
    ['$q', '$timeout', 'Usersessionservice', 'Modalservice', 'Appstatusservice', 'Appconfigservice',
    function($q, $timeout, Usersessionservice, Modalservice, Appstatusservice, Appconfigservice) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    this.authstring = 'https://user:password@api.pinboard.in/v1/';
    this.endpoint = 'https://api.pinboard.in/v1/';
    this.format = '?format=json';
    this.token = '&auth_token=user:apikey';
    this.timeout = 5000;

    var self = this;

    /* ====================== INTERNALS ======================= */

    this.authCheck = function(deferred) {
      if(!Usersessionservice.isAuthenticated()) {
        $timeout(function() {
          deferred.reject('pinboardservice: user not authenticated.');
        }, 100);
        return true;
      } else {
        return false;
      }
    };

    this.checkConnection = function() {

      console.log('pinboardservice: checking connection...');

      var deferred = $q.defer();

      dns.resolve('www.google.com', function(err, addresses) {
        if (err) {
          // no connection
          console.log('we are not connected...', err);
          Usersessionservice.connection = false;
          deferred.reject(err);
        } else if (addresses) {
          // connection
          console.log('we are connected, addresses: ', addresses);
          Usersessionservice.connection = true;
          deferred.resolve(addresses);
        }
      });

      return deferred.promise;
    };

    this.setTimeout = function(newMilliSeconds) {
      this.timeout = newMilliSeconds;
    };

    this.handleRequestComplete = function(result, responsecode, deferred) {
      if (result instanceof Error) {
        console.error('Require: Error: ', result.message);
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

    this.executeStandardRequest = function(requestString, deferred, additionalOpts, optionalCompleteCallback) {
      
      var requestOptions = {
        url : requestString,
        method : 'GET',
        timeout : Appconfigservice.config.defaultTimeout
      };

      var specificOptions = {
        isDownload: false
      };
      
      if(!_.isEmpty(additionalOpts)) {
        requestOptions.timeout      = (!_.isEmpty(additionalOpts)) ? additionalOpts.timeout     : requestOptions.timeout;
        specificOptions.isDownload  = (!_.isEmpty(additionalOpts)) ? additionalOpts.isDownload  : requestOptions.isDownload;
      }
      
      var progressOptions = {
        throttle: 50,    // Throttle the progress event to x ms, defaults to 1000ms
        delay: 0         // Only start to emit after x delay, defaults to 0ms
      };

      var errorHandler = function (error) {
        Appstatusservice.resetProgress();
        console.warn(error);
        deferred.reject(error);
      };

      // start progress bar anyway!
      Appstatusservice.startProgress();

      if(specificOptions.isDownload === true) {
        console.log('using native https module for download...');
        // use node's native https module instead of request and request-progress
        var req = https.get(requestString).on('response', function(res) {
          
          var data = '';
          var trackProgress = false;

          if(res.headers['content-length'] !== undefined) {
            // we know how large the download will be so we can get the progress
            var len = parseInt(res.headers['content-length'], 10);
            var downloaded = 0;
            console.log('content-length was given: ', len);
            trackProgress = true;
          }

          // track progress
          res.on('data', function(chunk) {
            data += chunk;
            if(trackProgress) {
              downloaded += chunk.length;
              console.log('downloaded / len: ', downloaded, len, downloaded / len);
              Appstatusservice.updateProgress(downloaded, len);
            }
          });

          // end request and return data
          res.on('end', function () {
            // JSON parse and stringify object
            var json = JSON.stringify(JSON.parse(data));
            if(optionalCompleteCallback === undefined) {
              self.handleRequestComplete(json, res, deferred);
            } else {
              optionalCompleteCallback(json, res, deferred);
            }
            Appstatusservice.completeProgress();
            req.end();
          });

          // when errored
          res.on('error', function (err) {
            errorHandler('pinboardservice: error: '+ res.statusCode);
            req.end();
          });          
        });

      } else {
        // use request
        console.log('using request module for download...');
        // console.log('request options: ', requestOptions);
        progress(request(requestOptions, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            if(optionalCompleteCallback === undefined) {
              self.handleRequestComplete(body, response, deferred);
            } else {
              optionalCompleteCallback(body, response, deferred);
            }
            Appstatusservice.completeProgress();
          } else {
            errorHandler('pinboardservice: error: '+ error);
          }
        }), progressOptions)
        .on('progress', function (state) {
          // console.log('received size in bytes', state.received);
          // The properties bellow can be null if response does not contain
          // the content-length header
          // console.log('total size in bytes', state.total);
          // console.log('percent', state.percent);
          // update progressbar
          Appstatusservice.updateProgress(state.received, state.total);
        })
        .on('error', function (error) {
          errorHandler('pinboardservice: error: '+ error);
        })
      }
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
      if(this.authCheck(deferred)) {
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

      // execute standard request
      self.executeStandardRequest(request, deferred, {isDownload:true}, function(result, response, deferred) {
        // we only need the posts part. for some reason this is not the same result sent as in
        // get all bookmarks. probably there is metadata.
        var posts = JSON.stringify(JSON.parse(result).posts);
        self.handleRequestComplete(posts, response, deferred);
      });
      
      return deferred.promise;
    };

    this.getAllBookmarks = function() {

      var deferred = $q.defer();

      // check if authenticated
      if(this.authCheck(deferred)) {
        return deferred.promise;
      }

      console.log('pinboardservice: getting all bookmarks...');

      // create request
      var request = this.endpoint + 'posts/all' + this.format + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // execute standard request
      self.executeStandardRequest(request, deferred, {isDownload:true});
      
      return deferred.promise;
    };

    this.getBookmark = function() { // args: tags, url, date

      var deferred = $q.defer();

      // check if authenticated
      if(this.authCheck(deferred)) {
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
      if(this.authCheck(deferred)) {
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
      return this.addBookmark(bookmark, 'yes');
    };

    this.addBookmark = function(bookmark, replace) {
      
      var deferred = $q.defer();

      // check if authenticated
      if(this.authCheck(deferred)) {
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
      if(this.authCheck(deferred)) {
        return deferred.promise;
      }

      console.log('pinboardservice: getting all tags...');

      // create request
      var request = this.endpoint + 'tags/get' + this.format + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // execute standard request
      self.executeStandardRequest(request, deferred, {isDownload:true});
      
      return deferred.promise;
    };

    this.deleteTag = function(tagname) {
      
      var deferred = $q.defer();

      // check if authenticated
      if(this.authCheck(deferred)) {
        return deferred.promise;
      }

      console.log('pinboardservice: deleting tag...');

      // create request
      var tag = '&tag=' + encodeURIComponent(tagname);
      var request = this.endpoint + 'tags/delete' + this.format + tag + 
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // execute standard request
      self.executeStandardRequest(request, deferred);

      return deferred.promise;

    };

    this.renameTag = function(oldTagName, newTagName) {
      
      var deferred = $q.defer();

      // check if authenticated
      if(this.authCheck(deferred)) {
        return deferred.promise;
      }

      console.log('pinboardservice: renaming tag...');

      // create request
      var old = '&old=' + encodeURIComponent(oldTagName);
      var neww = '&new=' + encodeURIComponent(newTagName);
      var request = this.endpoint + 'tags/rename' + this.format + old + neww +
      this.token.replace('user', Usersessionservice.user).replace('apikey', Usersessionservice.apikey);

      // execute standard request
      self.executeStandardRequest(request, deferred);

      return deferred.promise;

    };

    this.foldTag = function(oldTagName, newTagName) {
      return this.renameTag(oldTagName, newTagName);
    };

    /* =================== CUSTOM REQUESTS ==================== */

    this.checkUrl = function(url) {

      var deferred = $q.defer();

      // check if authenticated
      if(this.authCheck(deferred)) {
        return deferred.promise;
      }

      console.log('pinboardservice: performing stale request...');

      // execute standard request
      self.executeStandardRequest(url, deferred, {timeout: Appconfigservice.config.staleCheckTimeout});
      
      return deferred.promise;
    };

  }]);
