(function() {
  'use strict';

  angular
    .module('application')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main', {
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('main.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'dashboard'
      })
      .state('main.deal', {
        url: '/deal',
        templateUrl: 'app/deal/deal.html',
        controller: 'DealController',
        controllerAs: 'deal'
      })
      // .state('main.identity-detail', {
      //   url: '/identity/{id}',
      //   templateUrl: 'app/identity/identity.detail.html',
      //   controller: 'IdentityDetailController',
      //   controllerAs: 'detail'
      // })
      // .state('main.policy', {
      //   url: '/policy',
      //   templateUrl: 'app/policy/policy.html',
      //   controller: 'PolicyController',
      //   controllerAs: 'policy'
      // })
      // .state('main.policy-detail', {
      //   url: '/policy/{id}',
      //   templateUrl: 'app/policy/policy.detail.html',
      //   controller: 'PolicyDetailController',
      //   controllerAs: 'detail'
      // })
      // .state('main.group', {
      //   url: '/group',
      //   templateUrl: 'app/group/group.html',
      //   controller: 'GroupController',
      //   controllerAs: 'group'
      // })
      // .state('main.group-detail', {
      //   url: '/group/{id}',
      //   templateUrl: 'app/group/group.detail.html',
      //   controller: 'GroupDetailController',
      //   controllerAs: 'detail'
      // })
      // .state('main.permission', {
      //   url: '/permission',
      //   templateUrl: 'app/permission/permission.html',
      //   controller: 'PermissionController',
      //   controllerAs: 'permission'
      // })
      // .state('main.permission-detail', {
      //   url: '/permission/{id}',
      //   templateUrl: 'app/permission/permission.detail.html',
      //   controller: 'PermissionDetailController',
      //   controllerAs: 'detail'
      // })
      // .state('main.domain', {
      //   url: '/domain',
      //   templateUrl: 'app/domain/domain.html',
      //   controller: 'DomainController',
      //   controllerAs: 'domain'
      // })
      // .state('main.domain-detail', {
      //   url: '/domain/{id}',
      //   templateUrl: 'app/domain/domain.detail.html',
      //   controller: 'DomainDetailController',
      //   controllerAs: 'detail'
      // })
      ;

      // $urlRouterProvider.otherwise('/dashboard');
      $urlRouterProvider.otherwise(function($injector, $location){
  		var state = $injector.get('$state');
  		state.go("main.dashboard", $location.search());
  		return $location.path();
    });
  }
})();
