
/**
 * @ngdoc function
 * @name pinboredWebkitApp.controllers.controller:SearchableViewCtrl
 * @description
 * # SearchableViewCtrl
 * Controller of the pinboredWebkitApp.controllers
 */
angular.module('pinboredWebkitApp.controllers')
  .controller('SearchableViewCtrl', 
    ['$scope', '$timeout', '$filter', 'Usersessionservice', 'Utilservice', 'Appconfigservice', 
    'bookmarkFulltextFilter', 'bookmarkTagsFilter', 'tagFulltextFilter', 
    function ($scope, $timeout, $filter, Usersessionservice, Utilservice, Appconfigservice, 
      bookmarkFulltextFilter, bookmarkTagsFilter, tagFulltextFilter) {
    
    // shared searchable view model
    $scope.filter = {
      filterDelay : 500,
      text : '',
      tags : []
    };

    // page model
    $scope.data = {
      isLoading : true,
      tagNames : [],
      items: [],
      filteredList : []
    };

    // paging
    $scope.paging = {
      numPageButtons : 10,
      current : 1,
      totalItems : 0
    };

    // page config
    $scope.config = {
      collectionType : '',
      itemsPerPage : 0,
      tagFilterType : false,
      tagFilterTypeText : 'inclusive / and',
      searchAllWords : false,
      searchAllWordsText : 'search all words',
      hasButtonPaging : true,
      hasButtonTagFilter : true,
      hasButtonTextFilter : true,
      hasButtonMorefilters : false,
      showSearch : false,
      showTags : false,
      showPager : false,
      showExtra : false,
      showExtraBookmarkFilters : false,
      showExtraTagFilters : false
    }

    // setup watchers for debouncing the function that they should call
    $scope.$watch('filter.text', function(newValue, oldValue) {
      $scope.updateFiltersPaging();
    });

    $scope.$watch('config.showExtra', function(newValue, oldValue) {
      if(newValue === true) {
        switch($scope.config.collectionType) {
          case 'bookmarks': $scope.config.showExtraBookmarkFilters = true; break;
          case 'tags': $scope.config.showExtraTagFilters = true; break;
        }
      } else {
        $scope.config.showExtraBookmarkFilters = $scope.config.showExtraTagFilters = false;
      }
    });

    $scope.setLoadingState = function() {
      // reset state vars to initial state
      $scope.data.isLoading = true;
      $scope.data.items = [];
      $scope.paging.current = 1;
      $scope.paging.totalItems = 0;
    }

    $scope.checkMaxTags = function(amount) {
      if($scope.filter.tags.length > amount) {
        // remove tag, one too many
        $scope.filter.tags.splice($scope.filter.tags.indexOf($scope.filter.tags[$scope.filter.tags.length-1]), 1);
      }
    };

    // array return format: { text: 'Tag1' }, { text: 'Tag2' }, { text: 'Tag3' }, { text: 'Tag4' }
    // see: http://mbenford.github.io/ngTagsInput/gettingstarted under 'Autocomplete'
    $scope.loadTagItems = function(query) {
      // return filtered parent scope' tagNames with query (which is user input)
      return $filter('filter')($scope.data.tagNames, query) || [];
    };

    $scope.onSearchTagChanged = function () {
      $scope.checkMaxTags($scope.appconfig.maxTagSearch);
      $scope.updateFiltersPaging();
    };

    $scope.onFoldIntoTagChanged = function () {
      $scope.checkMaxTags(1);
    };

    $scope.onNewTagChanged = function () {
      $scope.checkMaxTags(1);
    };

    $scope.updateFiltersPaging = function() {
      $scope.applyFilters();
      $scope.updatePaging();
    };

    $scope.updatePaging = function() {
      $scope.paging.totalItems = Math.min($scope.data.items.length, $scope.data.filteredList.length);
      console.log('paging total items: ' + $scope.paging.totalItems);
    };

    $scope.applyFilters = function() {
      console.log('applying filters to list...');
      var word = $scope.filter.text;
      var tags = $scope.filter.tags;
      var logicType = ($scope.appconfig.tagFilterType === true) ? 'AND' : 'OR';
      switch($scope.config.collectionType) {
        case 'bookmarks':
          $scope.data.filteredList = bookmarkFulltextFilter($scope.data.items, word);
          $scope.data.filteredList = bookmarkTagsFilter($scope.data.filteredList, tags, logicType);
          break;
        case 'tags':
          $scope.data.filteredList = tagFulltextFilter($scope.data.items, word);
          break;
      }
    };

    $scope.$on('$viewContentLoaded', function() {
      console.info('searchable view controller $viewContentLoaded called');

      // bind mousetrap, can be overwritten in sub views
      Mousetrap.bind('mod+f', $scope.hotkeySearch);
      Mousetrap.bind('mod+t', $scope.hotkeySearchTag);
    });

    $scope.$on('$destroy', function() {
      console.info('searchable view controller $destroy called');

      // unbind mousetraps
      Mousetrap.unbind('mod+f');
      Mousetrap.unbind('mod+t');
    });

  }]);
