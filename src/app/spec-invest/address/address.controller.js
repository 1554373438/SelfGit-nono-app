(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SpecInvestAddressController', SpecInvestAddressController);

  /** @ngInject */
  function SpecInvestAddressController($state, OrderService, UserApi) {
    var vm = this,
      order = OrderService.getOrder();
    vm.info = {};
    vm.submit = submit;

    init();

    function init() {
      if (!order.userId) {
        UserApi.getDeliverInfo().success(function(res) {
          if (res.flag == 1) {
            var data = res.data;
            if (res.data) {
              vm.info.userId = res.data.userId;
              vm.info.receiver = res.data.receiver;
              vm.info.address = res.data.address;
              vm.info.mobileNum = res.data.mobileNum;
              OrderService.updateOrder(vm.info);
            }
          }
        });
      } else {
        vm.info.receiver = order.receiver;
        vm.info.mobileNum = order.mobileNum;
        vm.info.address = order.address;
      }

    }

    function submit() {
       OrderService.updateOrder(vm.info);
       
       $state.go('specInvest:purchase');
    }


  }
})();
