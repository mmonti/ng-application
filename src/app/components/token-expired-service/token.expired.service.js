(function () {
  'use strict';

  angular.module('application')
    .factory('tokenExpiredService', TokenExpiredService);

  /** @ngInject */
  function TokenExpiredService($injector, $q) {

    var promise = null;

    // Public API here
    return {
      request: function (config) {
        return config;
      },
      requestError: function (rejection) {
        return rejection;
      },
      response: function (response) {
        return response;
      },
      responseError: function (rejection) {
        var configuration = $injector.get('configuration');
        var authService = $injector.get('authService');
        var $http = $injector.get('$http');
        var $log = $injector.get('$log');

        var isRTR = rejection.config.refreshTokenRequest || false;
        if (isRTR && rejection.status === 401) {
          $log.debug("refreshToken also expired.");
          promise.reject(rejection)
          return rejection;
        }

        // = 401 - The token expired so we will try to use the refreshToken to extend the TTL.
        var status = rejection.status;
        if (status === 401) {

          if (!promise) {
            promise = $q.defer();

            $log.debug("Trying to refresh the token");
            authService.refreshToken().then(function(refreshResponse){

              if (refreshResponse.status === 401) {
                $log.debug("User need to authenticate again - here we go... wiiiiiiii!!!");
                return authService.doLogin();
              }

              var tokenKey = configuration.getAuthTokenHeaderName();
              var refreshTokenKey = configuration.getAuthTokenRefreshHeaderName();

              var token = refreshResponse.data[tokenKey];
              var refreshToken = refreshResponse.data[refreshTokenKey];

              $log.debug("Token refreshed - saving new tokens.");
              authService.saveToken(token, tokenKey);
              authService.saveToken(refreshToken, refreshTokenKey);

              return $http(rejection.config);

            }, function(refreshRejection){
              $log.debug(refreshRejection);

            }).catch(function(){
              $log.debug("An error occurred trying to refresh the token.");
            });
          }

          return promise.promise;
        }
        return rejection;
      }
    }
  }
})();
