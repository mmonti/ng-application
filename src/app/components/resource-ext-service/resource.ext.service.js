(function() {
  'use strict';

  angular.module('application')
      .factory('resourceExtension', ResourceExtensionService);

  /** @ngInject */
  function ResourceExtensionService() {
    // Service logic
    var entity = null;
    // Public API here
    return {
        extend: function (getResourceFn, serviceEndpoint) {
            var ext = {
                path: function(endpoint) {
                    return getResourceFn(serviceEndpoint + endpoint);
                },
                setEntity: function(param) {
                    entity = param;
                },
                getEntity: function() {
                    return entity;
                }
            }

            var resource = getResourceFn(serviceEndpoint);
            angular.extend(resource, ext);

            return resource;
        }
    };
  }
})();
