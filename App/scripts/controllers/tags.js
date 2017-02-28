/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('TagsCtrl',
    ['$q', '$scope', '$controller', '$filter', '$location',
      'Pinboardservice', 'Bookmarkservice', 'Appstatusservice', 'Usersessionservice', 'Events',
      function ($q, $scope, $controller, $filter, $location,
        Pinboardservice, Bookmarkservice, Appstatusservice, Usersessionservice, Events) {
        // Initialize the super (controller) class and extend it.
        angular.extend(this, $controller('BaseViewCtrl', {$scope: $scope}))

        // Search functionality
        angular.extend(this, $controller('SearchableViewCtrl', {$scope: $scope}))

        angular.extend($scope.data, {
          numTags: 0
        })

        angular.extend($scope.config, {
          itemsPerPage: 39 // 39 = 13 rows * 3 cols
        })

        $scope.gridsterOpts = {
          columns: 6, // the width of the grid, in columns
          pushing: true, // whether to push other items out of the way on move or resize
          floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
          swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
          width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
          colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
          rowHeight: 75, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
          margins: [4, 4], // the pixel distance between each widget
          outerMargin: true, // whether margins apply to outer edges of the grid
          isMobile: false, // stacks the grid items if true
          // mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
          mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
          minColumns: 6, // the minimum columns the grid must have
          minRows: 2, // the minimum height of the grid, in rows
          maxRows: 100,
          // defaultSizeX: 2, // the default width of a gridster item, if not specifed
          // defaultSizeY: 1, // the default height of a gridster item, if not specified
          minSizeX: 2, // minimum column width of an item
          maxSizeX: 3, // maximum column width of an item
          minSizeY: 1, // minumum row height of an item
          maxSizeY: 5, // maximum row height of an item
          resizable: {
            enabled: true,
            handles: [] // ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw']
          // start: function(event, $element, widget) {}, // optional callback fired when resize is started,
          // resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
          // stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
          },
          draggable: {
            enabled: false // whether dragging items is supported
          // handle: '.my-class', // optional selector for resize handle
          // start: function(event, $element, widget) {}, // optional callback fired when drag is started,
          // drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
          // stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
          }
        }

        // array return format: { text: 'Tag1' }, { text: 'Tag2' }, { text: 'Tag3' }, { text: 'Tag4' }
        // see: http://mbenford.github.io/ngTagsInput/gettingstarted under 'Autocomplete'
        $scope.loadTagItems = function (query) {
          // return filtered parent scope' tagNames with query (which is user input)
          return $filter('filter')($scope.data.tagNames, query) || []
        }

        $scope.resetTags = function () {
          $scope.data.tagNames = []
          $scope.data.items = []
        }

        $scope.createTags = function (tagdata) {
          var deferred = $q.defer()
          var tagID = 0

          for (var tag in tagdata) {
            if (tagdata.hasOwnProperty(tag)) {
              // store stripped down version for autocomplete
              $scope.data.tagNames.push({
                text: tag
              })
              // wrapped tags (for angular-gridster)
              $scope.data.items.push({
                id: tagID,
                tagname: tag,
                occurrences: parseInt(tagdata[tag], 10),
                sizeX: 2,
                sizeY: 1
              })
              tagID++
            }
          }

          $scope.data.numTags = $scope.paging.totalItems = $scope.data.items.length

          if ($scope.data.numTags > 0) {
            console.log($scope.data.numTags + ' tags retrieved.')
            setTimeout(deferred.resolve(), 100)
          } else {
            console.warn('no tags received, so no tags created.')
            setTimeout(deferred.reject('no tags received, so no tags created.'), 100)
          }

          return deferred.promise
        }

        $scope.repopulateTags = function () {
          // clearing all tags
          Appstatusservice.updateStatus('clearing all tags...')
          $scope.resetTags()
          // get all tags  
          Appstatusservice.updateStatus('retrieving all tags...')

          Pinboardservice.getAllTags()
            .then($scope.createTags)
            .then(function () {
              $scope.data.isLoading = false
              Appstatusservice.updateStatus('all tags retrieved.')
              $scope.updateFiltersPaging()
            })
            .catch(function (failreason) {
              console.error('Failed: ' + failreason)
            })
        }

        $scope.removeTag = function (tag) {
          console.log('tags :: removetag called...')
          $scope.data.items.splice($scope.data.items.indexOf(tag), 1)
        }

        $scope.updateTag = function (oldTagName, newTagName, type) {
          console.log('tags :: updatetag called...')
          var index = R.findIndex(R.propEq('tagname', oldTagName))($scope.data.items)
          console.log('tags :: index: ' + index)
          if (index !== undefined) {
            if (type === 'rename') {
              // rename the tag in $scope.data.items and $scope.data.tagNames
              $scope.data.items[index].tagname = newTagName
              $scope.data.tagNames[index].text = newTagName
            } else if (type === 'fold') {
              var hasOldTag = function (oldTagName) {
                return Bookmarkservice.hasBookmarkTag(oldTagName)
              }(oldTagName)

              var hasBothTags = function (oldTagName, newTagName) {
                return Bookmarkservice.hasBookmarkTag(oldTagName) && Bookmarkservice.hasBookmarkTag(newTagName)
              }

              console.log('functions:')
              console.log(hasOldTag)
              console.log(hasBothTags)

              // increase the occurrence count of the tag that got another tag folded into it.
              // this number is equal to all bookmarks that have the old tag minus all bookmarks that had both tags.
              var bookmarksWithOldTag = R.filter(hasOldTag, $scope.data.items)
              var bookmarksWithBothTags = R.filter(hasBothTags, $scope.data.items)

              console.log('bms with old tag: ', bookmarksWithOldTag)
              console.log('bms with both tags: ', bookmarksWithBothTags)

              var occurrencesToAdd = bookmarksWithOldTag.length - bookmarksWithBothTags.length

              console.log('occurrencesToAdd: ', occurrencesToAdd)

              // add the occurrences of the old tag to the new tag (which it was folded into)
              $scope.data.items[index].occurrences = $scope.data.items[index].occurrences + occurrencesToAdd

              // remove the old tag name
              $scope.removeTag($scope.data.items[index])
            }
          }
        }

        $scope.getTagByName = function (tagName) {
          console.log('tags :: get tag by name called...')
          var foundTag = _.find($scope.data.items, function (tag) {
            // console.log('tag.tagname === tagName? ', tag.tagname, tagName, tag.tagname === tagName)
            return tag.tagname === tagName
          })
          return foundTag
        }

        // PAGING AND FILTERS

        $scope.hotkeySearch = function () {
          $scope.config.showSearch = ($scope.config.showSearch === false) ? true : false
          // console.log('search called! ', $scope.config.showSearch)
          $scope.$apply()
        }

        $scope.hotkeySearchTag = function () {
          $scope.config.showTags = ($scope.config.showTags === false) ? true : false
          // console.log('search called! ', $scope.config.showTags)
          $scope.$apply()
        }

        // EVENTS

        // listen to bookmark events
        $scope.$on(Events.bm.delete, function (event, deletedBookmark) {
          console.log('bookmark DELETED: ', deletedBookmark)
          var tagUsedFound = false
          _.each($scope.data.items, function (tag) {
            _.each(deletedBookmark.data.tags.split(' '), function (deletedBookmarkTag) {
              if (tag.tagname === deletedBookmarkTag) {
                tagUsedFound = true
                $scope.decreaseTagOccurenceCount(tag)
                return
              }
              if (tagUsedFound) return
            })
            if (tagUsedFound) return
          })
        })

        // SETUP AND INITIALISATION

        $scope.$on('$viewContentLoaded', function () {
          console.info('tags $viewContentLoaded called')

          $scope.config.collectionType = 'tags'

          // repopulate bookmark items.
          $scope.repopulateTags()
        })

        $scope.$on('$destroy', function () {
          console.info('tags $destroy called')
        })

        // update current page
        Usersessionservice.setCurrentSection('tags')

        // tag screen does not need a tag filter
        $scope.config.hasButtonTagFilter = false
      }])
