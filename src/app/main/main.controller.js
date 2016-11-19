(function() {
  'use strict';

  angular
    .module('application')
    .controller('MainController', MainController);

	/** @ngInject */
	function MainController(mobileView, $log, $scope, $window, $cookieStore, configuration) {
		var vm = this;
		// = Gets the info to show the git build number.
    vm.applicationName = configuration.getApplicationName();
		// = Menus Definition.
		vm.menus = [{
			name: "Dashboard",
			state: "main.dashboard",
			icon: "icon-dashboard"
		}
    ,{
			name: "Deals",
			state: "main.deal",
			icon: "icon-user"
		}
    ];

		vm.selectedMenu = { name: "Dashboard" };
		vm.selectMenu = function(menu){
			vm.selectedMenu = menu;
		}

		// = Toggle MenuBar Handlers.
		vm.getWidth = function() {
			return $window.innerWidth;
		};

    if($cookieStore.get('sideBarOpen') == true) {
      vm.sideBarOpen = !vm.sideBarOpen;
    }
    else {
      vm.sideBarOpen = vm.sideBarOpen;
    }

		vm.toggleSidebar = function() {
			vm.sideBarOpen = !vm.sideBarOpen;
			$cookieStore.put('sideBarOpen', vm.sideBarOpen);
		};

		$window.onresize = function() {
			$scope.$apply();
		};
	}
})();
