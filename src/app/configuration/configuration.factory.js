(function () {
  'use strict';

  angular.module('application')
    .factory('configuration', ConfigurationFactory);

  /** @ngInject */
  function ConfigurationFactory($location, $log, configurationData) {

    var configuration = {};
    angular.extend(configuration, configurationData);

    // = Internal API
    var expander = (function () {
      var replacer = function (context) {
        return function (s, name) {
          return context[name];
        };
      };
      return function (input, context) {
        return input.replace(/\{(\w+)\}/g, replacer(context));
      };
    })();

    // = Public API
    var services = {
      getApplicationName: function() {
        return configuration.applicationName;
      },
      useAuthTokenHeader: function () {
        return configuration.authentication.useAuthTokenHeader;
      },
      isAuthEnabled: function () {
        return configuration.authentication.authEnabled;
      },
      getAuthTokenHeaderName: function () {
        return configuration.authentication.authTokenHeaderName;
      },
      getAuthTokenRefreshHeaderName: function () {
        return configuration.authentication.authTokenRefreshHeaderName;
      },
      getAuthTokenCookieKey: function () {
        return configuration.authentication.authTokenCookieKey;
      },

      isPublic: function (url) {
        var contains = false;
        angular.forEach(configuration.public, function (path) {
          if (url.indexOf(path) > -1) {
            contains = true;
          }
        })
        return contains;
      },

      getPaths: function () {
        return configuration.paths;
      },

      getPath: function (key) {
        return configuration.paths[key];
      },

      getEnvironment: function () {
        return configuration.environment;
      },

      getHost: function () {
        var port = '';
        if (configuration.server.port) {
          port = ':' + configuration.server.port;
        }
        return configuration.server.protocol + '://' + configuration.server.host + port;
      },

      getEndpointBase: function () {
        return configuration.endpointBase;
      },

      getEndpoints: function () {
        return configuration.endpoints;
      },

      getServicePath: function (serviceName, context) {
        return services.getServiceEndpoint(serviceName, context, false, false);
      },

      getServiceEndpoint: function (serviceName, context, includeHost, includeBase) {
        for (var currentEndpoint in configuration.endpoints) {
          if (configuration.endpoints.hasOwnProperty(serviceName)) {
            if (currentEndpoint === serviceName) {
              var solvedEndpoint = "";

              includeHost = (angular.isUndefined(includeHost)) ? true : includeHost;
              includeBase = (angular.isUndefined(includeBase)) ? true : includeBase;

              if (includeHost) {
                solvedEndpoint += services.getHost();
              }
              if (includeBase) {
                solvedEndpoint += services.getEndpointBase();
              }

              solvedEndpoint += configuration.endpoints[serviceName];

              if (context) {
                return expander(solvedEndpoint, context);
              }
              return solvedEndpoint;
            }
          }
        }
      }
    };
    return services;
  }
})();
