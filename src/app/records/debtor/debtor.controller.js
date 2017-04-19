(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsDebtorController', RecordsDebtorController);

  /** @ngInject */
  function RecordsDebtorController(localStorageService) {
    var vm = this;

    vm.list = localStorageService.get('record').borrowDebts.map(function(_item) {
      _item.boName = _item.boName.substr(0, 1) + '**';
      _item.boTime = _item.boTime.split(' ')[0];
      return _item;
    });
    
  }
})();
