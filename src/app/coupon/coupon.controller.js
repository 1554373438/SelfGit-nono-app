(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('CouponController', CouponController);

  /** @ngInject */
  function CouponController(CouponService, $stateParams, $log) {
    var vm = this;

    vm.type = $stateParams.type;
    
    if(vm.type == 'interest') {
      vm.list = CouponService.interestList;
    } else {
      vm.list = CouponService.cashList;
    }
   
  }
})();
