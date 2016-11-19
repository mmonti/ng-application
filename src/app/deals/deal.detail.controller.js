(function() {
  'use strict';

  angular.module('application')
    .controller('DealDetailController', DealDetailController);

  /** @ngInject */
  function DealDetailController($scope, $q, $log, $state, $stateParams, utils, itemSelectorService, dialogService, alertService, dealService) {
    var vm = this;

	// = Add a reference to the alerts.
	vm.alert = alertService.getInstance();

    // = 0:view / 1:edit /2:new
    vm.mode = 0;

    // = ID of the identity to edit. Can be empty if we are creating a new identity.
    vm.id = $stateParams.id;

    vm.identity = {};
    // = View / Edit
    if (vm.id) {
        dealService.byId({ id: vm.id, attrs: ['groups', 'policies', 'domains'] }, function(response){
            vm.identity = response;

            // = We check the editing object has changed.
            $scope.$watch(function() { return vm.identity }, function(nv, ov){
                if (nv === ov) { return; }
                $scope.detailForm.$setDirty();
            }, true);
        });
    } else {
        // if no id is comming, we are creating a new entity.
        vm.mode = 2;
    }

    vm.setDisplayName = function() {
      if (angular.isDefined(vm.identity.firstName) && vm.identity.firstName != '' &&
          angular.isDefined(vm.identity.lastName) && vm.identity.lastName != '' &&
         (angular.isUndefined(vm.identity.displayName) || angular.isDefined(vm.identity.displayName) && vm.identity.displayName === '')

      ) {

        vm.identity.displayName = vm.identity.firstName + " " + vm.identity.lastName;
      }
    }

	  // = Handle the Edit.
    vm.onEdit = function() {
      vm.previousState = angular.copy(vm.identity);
      vm.mode = 1;
	  }

    // = On Save
    vm.onSave = function(valid) {
        if (valid) {
            var modal = dialogService.getInstance({
                resolve: {
                  definitions : function() {
                      return {
                          title : "Save Changes",
                          content: "Are you sure you want to save these changes?"
                      }
                  }
                }
            });
            modal.result.then(function(resolved) {
                $log.debug("resolved=%s", resolved);
                var handleResponse = function(response){
                    vm.identity = response;
                    vm.mode = 0;
                    delete vm.previousState;
                }
                if (vm.mode === 1) {
                  var actions = [];
                  if ($scope.detailForm.$dirty) {
                    actions.push(identityService.update({id: vm.identity.id}, vm.identity).$promise);
                  }
                  var toRemoveDomains = utils.diff(vm.previousState.domains, vm.identity.domains, 'id');
                  var toAddDomains = utils.diff(vm.identity.domains, vm.previousState.domains, 'id');

                  if ((toRemoveDomains.length > 0)) {
                    actions.push(identityService.removeDomains({ id: vm.identity.id, ids: utils.flattern(toRemoveDomains, 'id') }).$promise);
                  }
                  if ((toAddDomains.length > 0)) {
                    actions.push(identityService.addDomains({id: vm.identity.id}, utils.flattern(toAddDomains, 'id')).$promise);
                  }

                  var toRemoveGroups = utils.diff(vm.previousState.groups, vm.identity.groups, 'id');
                  var toAddGroups = utils.diff(vm.identity.groups, vm.previousState.groups, 'id');

                  if ((toRemoveGroups.length > 0)) {
                    actions.push(identityService.removeGroups({ id: vm.identity.id, ids: utils.flattern(toRemoveGroups, 'id') }).$promise);
                  }
                  if ((toAddGroups.length > 0)) {
                    actions.push(identityService.addGroups({id: vm.identity.id}, utils.flattern(toAddGroups, 'id')).$promise);
                  }

                  var toRemovePolicies = utils.diff(vm.previousState.policies, vm.identity.policies, 'id');
                  var toAddPolicies = utils.diff(vm.identity.policies, vm.previousState.policies, 'id');

                  if ((toRemovePolicies.length > 0)) {
                    actions.push(identityService.removePolicies({ id: vm.identity.id, ids: utils.flattern(toRemovePolicies, 'id') }).$promise);
                  }
                  if ((toAddPolicies.length > 0)) {
                    actions.push(identityService.addPolicies({id: vm.identity.id}, utils.flattern(toAddPolicies, 'id')).$promise);
                  }

                  $q.allSettled(actions).then(
                    function() {
                      handleResponse(vm.identity)
                      vm.alert.enqueue({message: 'Identity Updated!', type: 'success', icon: 'icon-ok'});
                    },
                    function() {
                      vm.alert.enqueue({message: 'Ops! An error occurred trying to update the identity.', type: 'warning', icon: 'icon-warning-sign'})
                    }
                  );

                } else if (vm.mode === 2) {
                    return identityService.save(vm.identity, function() {
                      handleResponse(vm.identity);
                      vm.alert.enqueue({message: 'Identity Created!', type: 'success', icon: 'icon-ok'});
                      $state.go('main.identity');

                    }, function() {
                      vm.alert.enqueue({message: 'Ops! An error occurred trying to create a new identity.', type: 'warning', icon: 'icon-warning-sign'})
                    });
                }
            }, function () {
                $log.info('Dialog Save Changes Dismissed at: ' + new Date());
            });
        }
    }

    // = On Removes
    vm.onGroupRemove = function(group) {
        $log.debug("group=%s", group);
        vm.identity.groups.splice(vm.identity.groups.indexOf(group), 1);
    }
    vm.onPolicyRemove = function(policy) {
        $log.debug("policy=%s", policy);
        vm.identity.policies.splice(vm.identity.policies.indexOf(policy), 1);
    }
    vm.onDomainRemove = function(domain) {
        $log.debug("domain=%s", domain);
        vm.identity.domains.splice(vm.identity.domains.indexOf(domain), 1);
    }

    // = On Add new Group
    vm.onAddNewGroup = function() {
        var modal = itemSelectorService.getInstance({
            size: "lg",
            resolve: {
                entityService: function() { return groupService; },
                availableItems: function() { return null; },
                selectedItems: function() { return vm.identity.groups; },
                definitions : function() {
                    return {
                        title : "Group Selection"
                    }
                }
            }
        });
        modal.result.then(function(resolved) {
            vm.identity.groups = utils.omit(resolved, ['identities', 'policies']);
        }, function () {
            $log.info('Group Selector Dismissed at: ' + new Date());
        });
    }

    // = On Add New Policy
    vm.onAddNewPolicy = function() {
        var modal = itemSelectorService.getInstance({
            size: "lg",
            resolve: {
                entityService: function() { return policyService },
                availableItems: function() { return null; },
                selectedItems: function() { return vm.identity.policies; },
                definitions : function() {
                  return {
                    title : "Policy Selection"
                  }
                }
            }
        });
        modal.result.then(function(resolved) {
            vm.identity.policies = utils.omit(resolved, ['groups', 'permissions', 'identities']);
        }, function () {
            $log.info('Policy Selector Dismissed at: ' + new Date());
        });
    }

    // = On Add New Policy
    vm.onAddNewDomain = function() {
        var modal = itemSelectorService.getInstance({
            size: "lg",
            resolve: {
                entityService: function() { return domainService },
                availableItems: function() { return null; },
                selectedItems: function() { return vm.identity.domains; },
                definitions : function() {
                  return {
                    title : "Domain Selection"
                  }
                }
            }
        });
        modal.result.then(function(resolved) {
            vm.identity.domains = utils.omit(resolved, ['identities']);
        }, function () {
            $log.info('Domain Selector Dismissed at: ' + new Date());
        });
    }

    // = On Identity Revoke
    vm.onRevoke = function() {
        var modal = dialogService.getInstance({
            resolve: {
              definitions : function() {
                  return {
                      title : "Revoke Confirmation",
                      content: "Are you sure you want to revoke this Identity?"
                  }
              }
            }
        });
        modal.result.then(function(resolved) {
            $log.debug("resolved=%s", resolved);
            identityService.revoke({ id: vm.identity.id }, function(data) {
                vm.identity = data;
                vm.mode = 0;
            });
        }, function () {
            $log.info('Dialog Revoke Identity Dismissed at: ' + new Date());
        });
    }

    // = On Identity Unrevoke
    vm.onUnrevoke = function() {
        var modal = dialogService.getInstance({
            resolve: {
              definitions : function() {
                  return {
                      title : "Unrevoke Confirmation",
                      content: "Are you sure you want to enable this Identity?"
                  }
              }
            }
        });
        modal.result.then(function(resolved) {
            $log.debug("resolved=%s", resolved);
            identityService.unrevoke({ id: vm.identity.id }, function(data) {
                vm.identity = data;
                vm.mode = 0;
            });
        }, function () {
            $log.info('Dialog Revoke Identity Dismissed at: ' + new Date());
        });
    }
  }
})();
