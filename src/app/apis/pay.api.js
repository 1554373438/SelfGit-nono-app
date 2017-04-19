(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('PayApi', PayApi);

  /** @ngInject */
  function PayApi($http, $log, APISERVER, user) {

    // 查询快钱之前银行卡接口
    this.getFastBankList = function() {
      return $http.get(APISERVER.FESERVER + '/pay/fastBankList');
    };

    // 电子账户充值确认
    this.rechargeConfirm = function(obj) {
      return base('/pay/rechargeConfirm', {
        orderNo: obj.orderNo,
        transNo: obj.transNo,
        smsCode: obj.smsCode,
        bankCardShortNo: obj.bankCardShortNo,
        token: obj.token
      });
    };


    function base(path, data, config) {
      return $http.post(APISERVER.FESERVER + path, data, config);
    }

    $log.debug('PayApi end');

  }
})();
