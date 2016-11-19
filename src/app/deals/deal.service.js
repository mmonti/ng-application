(function() {
  'use strict';

  angular.module('application')
      .factory('dealService', IdentityService);

  /** @ngInject */
  function DealService($resource, resourceExtension, configuration) {
      // Service logic
      var serviceEndpoint = configuration.getServiceEndpoint('deal', {}, true, true);
      // Public API here
      var getResource = function(endpoint) {
          return $resource(endpoint, {}, {
            byId: {
              url: configuration.getServiceEndpoint('identity.by-id', {}, true, true),
              method: 'GET',
              params: {
                'id' : '@id'
              }
            },
            page : {
              url: configuration.getServiceEndpoint('identity.page', {}, true, true),
              method: 'GET'
            },
            revoke : {
              url: configuration.getServiceEndpoint('identity.revoke', {}, true, true),
              method: 'PUT',
              params: {
                'id' : '@id'
              }
            },
            unrevoke : {
              url: configuration.getServiceEndpoint('identity.unrevoke', {}, true, true),
              method: 'PUT',
              params: {
                'id' : '@id'
              }
            },
            update : {
              method: 'PUT',
              url: configuration.getServiceEndpoint('identity.by-id', {}, true, true),
              params: {
                'id' : '@id'
              }
            },
            delete : {
              url: configuration.getServiceEndpoint('identity.by-id', {}, true, true),
              method: 'DELETE',
              params: {
                'id' : '@id'
              }
            },
            addDomains : {
              url: configuration.getServiceEndpoint('identity.domains', {}, true, true),
              method: 'POST',
              params: {
                'id' : '@id'
              }
            },
            removeDomains : {
              url: configuration.getServiceEndpoint('identity.domains', {}, true, true),
              method: 'DELETE',
              params: {
                'id' : '@id'
              }
            },
            addGroups : {
              url: configuration.getServiceEndpoint('identity.groups', {}, true, true),
              method: 'POST',
              params: {
                'id' : '@id'
              }
            },
            removeGroups : {
              url: configuration.getServiceEndpoint('identity.groups', {}, true, true),
              method: 'DELETE',
              params: {
                'id' : '@id'
              }
            },
            addPolicies : {
              url: configuration.getServiceEndpoint('identity.policies', {}, true, true),
              method: 'POST',
              params: {
                'id' : '@id'
              }
            },
            removePolicies : {
              url: configuration.getServiceEndpoint('identity.policies', {}, true, true),
              method: 'DELETE',
              params: {
                'id' : '@id'
              }
            }
        });
      }
      return resourceExtension.extend(getResource, serviceEndpoint);
  }
})();
