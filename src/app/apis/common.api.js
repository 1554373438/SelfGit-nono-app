(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('CommonApi', CommonApi);

  /** @ngInject */
  function CommonApi($http, $log, APISERVER) {

    //获取系统当前时间
    this.getSysTime = function() {
      return $http.get(APISERVER.FESERVER + '/common/current');
    };

    // Common_Agreement
    this.getAgreementTemplate = function(obj) {
     return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/agreement/template',
        params: {
          type: obj.type,
          productId: obj.productId
        }
      });
    };

    this.getAgreementInvest = function(obj) {
     return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/common/agreement/invest',
        params: {
          fpId: obj.fpId,
          boId: obj.boId,
          dblId: obj.dblId,
          transId: obj.transId
        }
      });
    };



   

    $log.debug('CommonApi end');

  }
})();
