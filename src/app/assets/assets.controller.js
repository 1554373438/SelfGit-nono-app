(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('AssetsController', AssetsController);

  /** @ngInject */
  function AssetsController(UserService, $log) {
    var vm = this;


    var balance = UserService.getAccountInfo();

    vm.info = {
      label: '总资产',
      total: balance.total,
      items: [
        {
          name: '可用余额',
          amount: balance.available,
          percentage: 100 * balance.available / balance.total,
          color: '#9B7BEB'
        },
        {
          name: '钱包资产',
          percentage: 100 * balance.demand / balance.total,
          amount: balance.demand,
          color: '#F6DB5D'
        },
        {
          name: '定期资产',
          percentage: 100 * balance.regular / balance.total,
          amount: balance.regular,
          color: '#7BCCEB'
        }
      ],
      size: 160
    };

  }
})();
