(function() {
  'use strict';

  angular.module('application')
      .service('itemSelectorService', ItemSelectorService);

  /** @ngInject */
  function ItemSelectorService($log, $modal, searchService, pagination) {
    return {
        getInstance : function(options) {
            var params = angular.extend(options, {
                templateUrl: 'app/components/item-selector/item.selector.html',
                controller: function($modalInstance, definitions, selectedItems, availableItems, entityService) {
                    var vm = this;
                    
                    vm.useSearchComponent = (availableItems === null);
                    
                    vm.definitions = definitions;
                    vm.availableItems = availableItems; 
                    vm.selectedItems = {};
                    
                    // = Transform array of domain entities into {id:entity} format.
                    // We need to change the format from array to {} to handle the selectedItems.
                    angular.forEach(selectedItems, function(item){
                        vm.selectedItems[item.id] = item;
                    });
                    
                    if (vm.useSearchComponent) {
                        var searchOptions = angular.extend({
                            pagination: pagination.getInstance(angular.extend({ size: 20, order: null }, ((definitions.pagination) || {}))),
                            fetch: function(params) {
                                entityService.page(params, function(data, status, headers, config) {
                                    $log.debug("entity-service-page data=%s, status=%s, headers=%s, config=%s", data, status, headers, config);
                                    vm.availableItems = vm.search.pagination.update(data);
                                });
                            }
                        }, ((definitions.search) || {}))

                        // = Search
                        vm.search = searchService.getInstance(searchOptions);
                        vm.search.onPageChange(1);    
                    
                    } else {
                        
                        // = Filter
                        vm.searchTerm = "";
                        vm.clearTerm = function() {
                            vm.searchTerm = "";
                        }    
                    }
                    
                    // = On each click on the checkbox update the model (selected items).
                    vm.updateSelectedItems = function($event, item) {
						if (!$event.target.checked) {
                            delete vm.selectedItems[item.id];
                        } else {
                            vm.selectedItems[item.id] = item;
                        }
                    }
                    
                    // = Transform an object map {id:entity} into a domain entities array.
                    vm.ok = function () {
                        var selection = [];
                        for (var key in vm.selectedItems) {
                            selection.push(vm.selectedItems[key]);
                        }
                        $modalInstance.close(selection); 
                    };
                    vm.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                controllerAs: 'itemSelector'
            });
            return $modal.open(params);
        }
    };
  }
})();
