(function () {
  'use strict';

  angular
    .module('application')
    .run(authentication)
    .run(runBlock);

  /** @ngInject */
  function authentication($log, $rootScope, $location, authService, configuration) {
    if (!configuration.isAuthEnabled()) {
      return;
    }

    var stateChange = $rootScope.$on('$stateChangeStart', function (event, next, current) {
      $log.debug('current state = %s', current);

      var tokenKey = configuration.getAuthTokenHeaderName();
      var refreshTokenKey = configuration.getAuthTokenRefreshHeaderName();

      //if (!authService.getToken(tokenKey)) {
        var token = $location.search()[tokenKey];
        var refreshToken = $location.search()[refreshTokenKey];

        if (!(typeof token === 'undefined' || typeof refreshToken === 'undefined')) {
          authService.saveToken(token, tokenKey);
          authService.saveToken(refreshToken, refreshTokenKey);
        }
      //}

      var requireLogin = true;
      if (next.data) {
        requireLogin = (next.data.private) ? next.data.private : true;
      }

      if (requireLogin && !authService.getToken(tokenKey)) {
        event.preventDefault();
        // = We send the user to log-in.
        authService.doLogin();
      }
    });
    $log.debug('listener added = %s', stateChange);
  }

  /** @ngInject */
  function runBlock($log) {
    $log.debug('run init - end');
  }

})();
