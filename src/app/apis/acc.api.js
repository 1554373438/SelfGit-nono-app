(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('AccApi', AccApi);

  /** @ngInject */
  function AccApi($http, $log, APISERVER, user) {

    //查询用户银行卡
    this.getBankCard = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/bankCard',
        params: {
          isLimit: obj.isLimit
        }
      });
    };

    //查询电子账户信息
    this.getEbankInfo = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/eBank',
        params: {
          userInfo: obj && obj.userInfo || 1
        }
      });
    };

    //查询福利券
    this.getCouponList = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/coupon',
        params: {
          id: obj.id,
          productType: obj.productType,
          couponType: 0
        }
      });
    };

    // 查询个人中心福利券
    this.getPageCoupon = function(obj) {
      return $http({
        method: 'get',
        url: APISERVER.FESERVER + '/acc/pageCoupon',
        params: {
          couponType: obj.couponType || 0,
          userCouponType: obj.userCouponType,
          isChooseOverdue: obj.isChooseOverdue || 0,
          isChooseUsed: obj.isChooseUsed || 0,
          pageInfo: {
            pageSize: obj.pageSize,
            currPageNo: obj.currPageNo
          }
        }
      });
    };

     //查询账户余额
    this.getBalance = function() {
      return $http.get(APISERVER.FESERVER + '/acc/balance');
    };


    $log.debug('AccApi end');

  }
})();
