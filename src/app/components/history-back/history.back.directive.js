(function() {
  'use strict';

  angular
    .module('application')
    .directive('historyBack', BackDirective);

  /** @ngInject */
  function BackDirective($window, $log) {
    var directive = {
      restrict: 'A',
      scope: {},
      controller: BackDirectiveController,
      controllerAs: 'vm',
      bindToController: true,
      link: function(scope, element, attributes) {
        $log.debug("attributes=%s", attributes);
        element.bind('click', function () {
            $window.history.back();
        });    
      }
    };

    return directive;

    /** @ngInject */
    function BackDirectiveController() {
      var vm = this
      $log.debug("view-model=[%s]", vm);
    }
  }
})();