(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('accountsController', accountsController);

  /** @ngInject */
  function accountsController($state, $stateParams, BasicApi) {
    var vm = this;

    vm.goBack = goBack;

    BasicApi.getmyDebtTransferDetail({
      type: $stateParams.type,
      id: $stateParams.id
    }).success(function(res) {
      if (res.succeed) {
        vm.items = res.data;
      }
    })

    function goBack(index) {
      $state.go('debt:protocol', { id: vm.items[index].agreementId })
    }


  }
})();
