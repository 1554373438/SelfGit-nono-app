(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('LimitController', LimitController);

  /** @ngInject */
  function LimitController(PayApi) {
    var vm = this;
    function descFormatter(str) {
      return str && str.replace(/,/g, '，').replace(/:/g, '：').replace('，银行', '<br>银行');
    }

    PayApi.getFastBankList().success(function(res) {
        if(res.succeed) {
           vm.list = res.data;
        }
    });
  }
})();
