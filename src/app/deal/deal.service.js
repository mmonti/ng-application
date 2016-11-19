(function() {
  'use strict';

  angular.module('application')
      .factory('dealService', DealService);

  /** @ngInject */
  function DealService($resource, resourceExtension, configuration) {
      // Service logic
      var serviceEndpoint = configuration.getServiceEndpoint('deal', {}, true, true);
      // Public API here
      var getResource = function(endpoint) {
          return $resource(endpoint, {}, {
            byId: {
              url: configuration.getServiceEndpoint('deal.by-id', {}, true, true),
              method: 'GET',
              params: {
                'id' : '@id'
              }
            },
            page : {
              url: configuration.getServiceEndpoint('deal.page', {}, true, true),
              method: 'GET'
            },
            revoke : {
              url: configuration.getServiceEndpoint('deal.revoke', {}, true, true),
              method: 'PUT',
              params: {
                'id' : '@id'
              }
            },
            unrevoke : {
              url: configuration.getServiceEndpoint('deal.unrevoke', {}, true, true),
              method: 'PUT',
              params: {
                'id' : '@id'
              }
            },
            update : {
              method: 'PUT',
              url: configuration.getServiceEndpoint('deal.by-id', {}, true, true),
              params: {
                'id' : '@id'
              }
            },
            delete : {
              url: configuration.getServiceEndpoint('deal.by-id', {}, true, true),
              method: 'DELETE',
              params: {
                'id' : '@id'
              }
            },
            addDomains : {
              url: configuration.getServiceEndpoint('deal.domains', {}, true, true),
              method: 'POST',
              params: {
                'id' : '@id'
              }
            },
            removeDomains : {
              url: configuration.getServiceEndpoint('deal.domains', {}, true, true),
              method: 'DELETE',
              params: {
                'id' : '@id'
              }
            },
            addGroups : {
              url: configuration.getServiceEndpoint('deal.groups', {}, true, true),
              method: 'POST',
              params: {
                'id' : '@id'
              }
            },
            removeGroups : {
              url: configuration.getServiceEndpoint('deal.groups', {}, true, true),
              method: 'DELETE',
              params: {
                'id' : '@id'
              }
            },
            addPolicies : {
              url: configuration.getServiceEndpoint('deal.policies', {}, true, true),
              method: 'POST',
              params: {
                'id' : '@id'
              }
            },
            removePolicies : {
              url: configuration.getServiceEndpoint('deal.policies', {}, true, true),
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
