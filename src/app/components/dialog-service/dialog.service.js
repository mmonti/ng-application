(function() {
  'use strict';

  angular.module('application')
      .service('dialogService', DialogService);

  /** @ngInject */
  function DialogService($modal) {
    return {
        getInstance : function(options) {
            var params = angular.extend({
                templateUrl: 'app/components/dialog-service/dialog.html',
                controller: function($modalInstance, definitions) {
                    var vm = this;
                    vm.definitions = definitions;
                    vm.confirm = function () {
                        $modalInstance.close(true);
                    };
                    vm.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },
                controllerAs: 'dialog'
            }, options);
            return $modal.open(params);
        }
    };
  }
})();
