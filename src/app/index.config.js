(function() {
  'use strict';

  angular
    .module('application')
    .config(config);

  /** @ngInject */
  function config($logProvider, $httpProvider, $animateProvider, $provide) {
    // = Enable log
    $logProvider.debugEnabled(true);

    // = Add token interceptor.
    $httpProvider.interceptors.push('requestInterceptorService');
    $httpProvider.interceptors.push('tokenExpiredService');

    // = Add content-type support for PATCH methods.
    $httpProvider.defaults.headers.patch = { 'Content-Type' : 'application/json;charset=utf-8' };

    // = Fix for flickering issue with ng-repeat and ng-animate: https://github.com/angular/angular.js/issues/3613
    $animateProvider.classNameFilter(/^((?!(repeat-modify)).)*$/);

    // = Decorate $q to implement allSettled.
    $provide.decorator('$q', ['$delegate', function ($delegate) {
      var $q = $delegate;
      $q.allSettled = $q.allSettled || function (promises) {
          var deferred = $q.defer();
          if (angular.isArray(promises)) {
            var states = [];
            var results = [];
            var didAPromiseFail = false;

            // First create an array for all promises setting their state to false (not completed)
            angular.forEach(promises, function (promise, key) { states[key] = false; });

            // Check if all states are finished
            var checkStates = function (states, results, deferred, failed) {
              var allFinished = true;
              angular.forEach(states, function (state) {
                if (!state) {
                  allFinished = false;
                  return;
                }
              });
              if (allFinished) {
                if (failed) {
                  deferred.reject(results);
                } else {
                  deferred.resolve(results);
                }
              }
            }

            // Loop through the promises a second loop to be sure that checkStates is called when all states are set to false first
            angular.forEach(promises, function (promise, key) {
              $q.when(promise).then(function (result) {
                states[key] = true; results[key] = result;
                checkStates(states, results, deferred, didAPromiseFail);
              }, function (reason) {
                states[key] = true; results[key] = reason; didAPromiseFail = true;
                checkStates(states, results, deferred, didAPromiseFail);
              });
            });
          } else {
            throw 'allSettled can only handle an array of promises (for now)';
          }
          return deferred.promise;
        };

      return $q;
    }]);
  }

})();
