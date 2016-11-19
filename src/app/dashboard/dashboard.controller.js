(function() {
  'use strict';

  angular
    .module('application')
    .controller('DashboardController', DashboardController);

  /** @ngInject */
  function DashboardController(managementService) {
    var vm = this;
    
    managementService.info(function(response){
        vm.info = response;     
    });
    
    managementService.health(function(response){
        vm.health = response;     
    });
    
    managementService.migrations(function(response){
        vm.migrations = response;     
    });
    
  }
})();
