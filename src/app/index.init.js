(function() {
  'use strict';

    angular.element(document).ready(function () {
        var injector = angular.injector(["ng"]);
        var $http = injector.get("$http");
        var $log = injector.get("$log");
        var $window = injector.get("$window");

		var localConfigurationFile = './app/configuration/' + $window.location.hostname + '-config.json';
        $log.debug('remote-configuration-file=%s', localConfigurationFile);

        // = Request the remote file.
        $http.get(localConfigurationFile).then(function(response) {

            // = Creates a module and a constant so we can inject the response in the configService.
            angular.module('remoteConfiguration', []).constant('configurationData', response.data);

            // = Bootstrap the application.
            angular.bootstrap(document, ['application']);

        }, function(errorResponse) {
            $log.debug('config file not available=%s', errorResponse);
        });
    });

})();
