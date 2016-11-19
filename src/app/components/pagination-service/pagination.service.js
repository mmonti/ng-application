(function() {
  'use strict';

  angular.module('application')
      .service('pagination', PaginationService);

  /** @ngInject */
  function PaginationService() {
    return {
        getInstance : function(options) {
            var instance = {
                page : {
                    content: [],
                    firstPage: true,
                    lastPage: false,
                    number: 0,
                    numberOfElements: 0,
                    size: 10,
                    sort: null,
                    totalElements: 0,
                    totalPages: 0
                },
                init : function(options) {
                    angular.extend(this.page, options);
                    this.setSort(options.sort);
                    this.setPage(options.number);
                    return this;
                },
                getTotalPages : function() {
                    return (this.page.totalPages === 0) ? 1 : this.page.totalPages;
                },
                getPageNumber : function() {
                    return (this.page.number === 0) ? 1 : this.page.number;
                },
                getTotalElements : function() {
                    return this.page.totalElements;
                },
                setSort : function(sort) {
                    if (!sort) {
                        return;
                    }   
                    this.page.sort = sort;
                },
                getSort : function() {
                    if (!this.page.sort) {
                        return;
                    }
                    var sorting = [];
                    var addSort = function(sort) {
                        sorting.push(sort.property + "," + sort.direction.toLowerCase());
                    }
                    if (angular.isArray(this.page.sort)) {
                        angular.forEach(this.page.sort, addSort);
                    } else {
                        addSort(this.page.sort);
                    }
                    return sorting;
                },
                getSortDirection : function() {
                    return this.page.sort.direction;
                },
                setPage : function(page) {
                    this.selectedPage = page
                },
                getPage : function(pageInformation) {
                    var resolvePageNumber = function(page) {
                        return (page == 0) ? 0 : (angular.isUndefined(pageInformation)) ? page : (page - 1);
                    }
                    if (angular.isUndefined(pageInformation)) {
                        return resolvePageNumber(this.getPageNumber());
                    }
                    return resolvePageNumber(pageInformation);
                },
                getPageSize : function() {
                    return this.page.size;
                },
                getContent : function() {
                    return this.page.content;
                },
                update : function(page) {
                    // = We need to update the page number since Spring uses 0 base index pagination.
                    page.number = page.number + 1;
                    
                    angular.extend(this.page, page);
                    return this.getContent();
                },
                getPageRequest : function(page, pageSize, sort) {
                    var currentPage = this.getPage(page);
                    var currentSize = (angular.isUndefined(pageSize)) ? this.getPageSize() : pageSize;
                    var currentSort = (angular.isUndefined(sort)) ? this.getSort() : sort;
                    return {
                        page: currentPage,
                        size: currentSize,
                        sort: currentSort
                    }
                }
            };
            return instance.init(options);
        }
    };
  }
})();
