(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('TopUpController', TopUpController);

  /** @ngInject */

  function TopUpController(EbankService, $scope, user, OrderService, toastr, TopUpService, AccApi) {
    var vm = this,
      order = {};

    OrderService.resetOrder();



    $scope.$on("$ionicView.beforeEnter", init);

    $scope.$on("$ionicView.afterEnter", balance);

    vm.submit = submit;

    function init() {
      AccApi.getEbankInfo().success(function(res) {
        if (res.succeed) {
          vm.eBank = res.data;
        }
      })      
  }

    function balance() {
      AccApi.getBalance().success(function(res) {
        if (res.succeed) {
          vm.nonoAvlBalance = res.data.nonoAvlBalance;
        }
      });
    }

    function submit() {
      var reg = /^([1-9][0-9]*)+(.[0-9]{1,2})?$/;
      if (!reg.test(vm.amount)) {
        toastr.info('请输入数字，至多保留两位小数');
        return;
      }
      order.price = order.needPay  = vm.amount;
      order.eBank = vm.eBank;
      OrderService.setOrder(order);

      TopUpService.showPayModal();
    }

  }
})();
