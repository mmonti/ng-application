(function() {
  'use strict';

  angular
    .module('application')
    .controller('DealController', DealController);

  /** @ngInject */
  function DealController($log, pagination, searchService, dealService) {
    var vm = this;

    // = List / Pills
    vm.viewMode = 0;

    // = Identities.
    vm.deals = [];

    // = Search Instance.
    vm.search = searchService.getInstance({
        pagination: pagination.getInstance({size: 20, sort: [/*{ property: 'displayName', direction: 'asc' }*/] }),
        fetch: function(params) {
            dealService.page(params, function(data, status, headers, config) {
                $log.info("data=%s, status=%s, headers=%s, config=%s", data, status, headers, config);
                vm.deals = vm.search.pagination.update(data);
            });
        },
        getRequestParams: function(page) {
            if (angular.isUndefined(page)) {
                page = vm.search.pagination.getPage();
            }
            var pageRequest = vm.search.pagination.getPageRequest(page);
            // = Show Revoked.
            var params = (vm.showRevoked) ? pageRequest : angular.extend({ revoked: false }, pageRequest);
            // = Search Term.
            return (vm.search.query !== null) ? angular.extend({
                title: vm.search.query
            }, params) : params;
        }
    });

    // = On Show Revoked Toggled.
    vm.showRevoked = false;
    vm.toggleShowRevoked = function() {
        vm.showRevoked = !vm.showRevoked;
        vm.search.onPageChange(vm.search.pagination.getPage());
    }

    // = Trigger Fetch.
    vm.search.onPageChange(0);
  }
})();
