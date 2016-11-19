(function() {
  'use strict';

  angular.module('application')
      .factory('requestInterceptorService', RequestInterceptorService);

  /** @ngInject */
  function RequestInterceptorService($cookieStore, configuration) {
    return {
		request: function(config) {
			var tokenKey = configuration.getAuthTokenHeaderName();
			var refreshTokenKey = configuration.getAuthTokenRefreshHeaderName()
			
			var tokenValue = $cookieStore.get(tokenKey);
			var refreshTokenValue = $cookieStore.get(refreshTokenKey);
			
			if (tokenValue !== null && refreshTokenValue !== null) {
				config.headers[tokenKey] = tokenValue;
				config.headers[refreshTokenKey] = refreshTokenValue;
			}
			return config;
		}
	}
  }
})();
