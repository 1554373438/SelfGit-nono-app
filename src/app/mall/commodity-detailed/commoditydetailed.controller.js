(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('CommodityDetailedController', CommodityDetailedController);

  /** @ngInject */
  function CommodityDetailedController(localStorageService,$log) {

    var vm = this;

    // vm.getDate = localStorageService.get('mall.product.detail');
    vm.getDetailImg = localStorageService.get('DetailImg');
  }

})();
