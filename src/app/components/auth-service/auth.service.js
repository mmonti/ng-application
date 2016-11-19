(function () {
  'use strict';

  angular.module('application')
    .factory('authService', AuthService);

  /** @ngInject */
  function AuthService($http, $q, $cookieStore, $window, $location, configuration) {
    // Internal
    var service = this;

    // Public API here
    return {
      saveToken: function (token, key) {
        if (typeof token === 'undefined') {
          return;
        }
        service[key] = token;
        $cookieStore.put(key, token);
      },
      refreshToken: function () {
        var refreshTokenKey = configuration.getAuthTokenRefreshHeaderName();
        var refreshToken = this.getToken(refreshTokenKey);
        var refreshEndpoint = configuration.getServiceEndpoint('auth.token.refresh', {}, false, false) + '?' + refreshTokenKey + '=' + refreshToken;

        return $http({method: 'POST', url: refreshEndpoint, refreshTokenRequest: true });
      },
      getToken: function (tokenKey) {
        if (service[tokenKey] === null || typeof service[tokenKey] === 'undefined') {
          var token = $cookieStore.get(tokenKey);
          if (token) {
            service[tokenKey] = token;
          }
        }
        return service[tokenKey];
      },
      doLogin: function () {
        return $window.location.href = configuration.getServicePath('auth.token.redirectUrl', {});
      }
    }
  }
})();
