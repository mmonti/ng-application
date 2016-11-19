(function() {
  'use strict';

  angular.module('application')
      .factory('searchService', SearchService);

  /** @ngInject */
  function SearchService() {    
    // Public API here
    return {
        getInstance : function(options) {
            var noop = function(){};
            var currentSort = { property: null, direction: 'asc' };
            var pagination = options.pagination || null;
            var query = options.query || "";   
            var fetch = options.fetch || noop;
            var onPageChange = options.onPageChange || function(page) {
                if (angular.isUndefined(page)) {
                    page = instance.pagination.getPageNumber();
                }
                var params = instance.getRequestParams(page);
                instance.fetch(params);
            }
            var getRequestParams = options.getRequestParams || function(page) {
                if (angular.isUndefined(page)) {
                    page = instance.pagination.getPage();    
                } 
                var pageRequest = instance.pagination.getPageRequest(page);
                return (instance.query !== null) ? angular.extend({ name: instance.query }, pageRequest) : pageRequest;
            }
            var onSearch = options.onSearch || function() {
                var params = instance.getRequestParams();
                instance.fetch(params);
            }
            var clear = options.clear || function() {
                instance.query = "";
                instance.onSearch();
            }
            var doSort = options.doSort || function(property) {
                if (currentSort.property != property) {
                    currentSort.direction = 'asc';
                }
                currentSort.property = property;
                currentSort.direction = (currentSort.direction === 'asc') ? 'desc' : 'asc';
                
                instance.pagination.setSort(currentSort);
                instance.onPageChange(instance.pagination.getPage());
            }
            
            var instance = {
                pagination: pagination,
                query: query,
                fetch: fetch,
                onPageChange: onPageChange,
                doSort: doSort,
                getRequestParams: getRequestParams,
                onSearch: onSearch,
                clear: clear 
            }
            
            return instance;
        }
    }
  }
})();
