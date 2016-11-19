(function() {
  'use strict';

  angular.module('application')
      .factory('managementService', ManagementService);

  /** @ngInject */
  function ManagementService($resource, resourceExtension, configuration) {
      // Service logic
      var serviceEndpoint = configuration.getServiceEndpoint('management', {}, true, true);
      // Public API here
      var getResource = function(endpoint) {
          return $resource(endpoint, {}, {
              health: {
                url: configuration.getServiceEndpoint('management.health', {}, true, true),
                method: 'GET'
              },
              info : {
                url: configuration.getServiceEndpoint('management.info', {}, true, true),
                method: 'GET'
              },
              beans : {
                url: configuration.getServiceEndpoint('management.beans', {}, true, true),
                method: 'GET'
              },
              configProps : {
                url: configuration.getServiceEndpoint('management.configprops', {}, true, true),
                method: 'GET'
              },
              trace: {
                url: configuration.getServiceEndpoint('management.trace', {}, true, true),
                method: 'GET'
              },
              env : {
                url: configuration.getServiceEndpoint('management.env', {}, true, true),
                method: 'GET'
              },
              metrics : {
                url: configuration.getServiceEndpoint('management.metrics', {}, true, true),
                method: 'GET'
              },
              migrations : {
                url: configuration.getServiceEndpoint('management.migrations', {}, true, true),
                method: 'GET',
                isArray: true
              }

          });
      }
      return resourceExtension.extend(getResource, serviceEndpoint);
  }
})();
