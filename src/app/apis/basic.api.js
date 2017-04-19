(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('BasicApi', BasicApi);

  /** @ngInject */
  function BasicApi($http, $log, APISERVER, user) {
    this.getUserType = function() {
      return base('/user/getUserType', {
        sessionId: user.sessionId
      });
    };

    this.getHomeData = function() {
      return $http({
        method: 'POST',
        url: APISERVER.MSAPI + '/dataBase/getHomePage',
        headers: { 'version': "5.0.0" },
        data: {
          version: '5.1.0',
          terminal: 4,
          sessionId: user.sessionId
        }
      });
    };

    this.goBBSLogin = function() {
      return base('/user/getUserBBSLoginAddress', {
        sessionId: user.sessionId
      });
    };

    this.getAppCoupon = function() {
      return base('/user/getAppCoupon', {
        sessionId: user.sessionId
      });
    };

    this.getProducts = function() {
      return base('/licai/getProductIndex');
    };

    this.getPlanList = function(obj) {
      return base('/licai/getFinancePlanListByType', {
        type: obj.type,
        sort: obj.sort,
        sortType: obj.sortType,
        pager: obj.pageIndex,
        pagesize: obj.itemsPerPage
      });
    };

    this.getWalletInfo = function() {
      return base('/licai/getCsyyDetailOfPerIssue');
    };

    this.getEnvoyInfo = function() {
      return base('/licai/prolocutorSettlement', {
        sessionId: user.sessionId
      });
    };

    this.getEnvoyRewardInfo = function() {
      return base('/licai/prolocutorRewards', {
        sessionId: user.sessionId
      });
    };

    this.getSpecInvestInfo = function(obj) {
      return base('/licai/getCharacterInvest', {
        pager: obj.pageIndex,
        pagesize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    this.getSpecInvestDetailInfo = function(obj) {
      return base('/licai/getCharacterInvestDetail', {
        productName: obj.productName
      });
    };

    this.getActivity = function() {
      return base('/banners/loadBanners', {
        position: 'nonoappactivity_new'
      });
    };

    this.getMallProductDetail = function(obj) {
      return base('/activityvip/getBangDetailText', {
        cb_id: obj.id
      });
    };

    this.getFinancePlan = function(obj) {
      return base('/user/getFinancePlan', {
        fpid: obj.id
      });
    };

    this.canBuyFinancePlan = function(obj) {
      return base('/licai/canBuyFinancePLan', {
        sessionId: user.sessionId,
        fpId: obj.id
      });
    };

    this.getPlanDetail = function(obj) {
      return base('/stagePlan/getPlanDetail');
    };

    this.addVipForm = function(obj) {
      return base('/stagePlan/addVipForm', {
        expectAmt: obj.expectAmt,
        fpId: obj.fp_id,
        sessionId: user.sessionId
      });
    };

    this.getBuyLogs = function(obj) {
      return base('/stagePlan/getBuyLogs', {
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      });
    }

    this.getPlanBorrows = function(obj) {
      return base('/licai/getPlanBorrows', {
        fp_id: obj.id,
        scope: obj.scope,
        page_num: obj.pageIndex,
        page_size: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    this.getBorrowerInfo = function(obj) {
      return base('/licai/getBorrowerInfo', {
        bo_id: obj.bo_id,
        user_id: obj.user_id,
      });
    };

    //计划类－产品－投资记录
    this.getPlanInvestRecords = function(obj) {
      return base('/licai/planInvestRecords', {
        fid: obj.id,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    this.getBidRecord = function(obj) {
      return base('/directInvestment/getBidRecord', {
        id: obj.id,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };




    // 投资记录-计划类
    this.investRecords = function(obj) {
      return $http.post(APISERVER.MSAPI + '/licai/userInvestRecords', {
        sessionId: user.sessionId,
        pageNum: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    // 投资记录-诺诺盈
    this.getInvestRecord = function(obj) {
      return $http.post(APISERVER.MSAPI + '/directInvestment/getInvestRecord', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    // 投资记录-诺诺盈-投资详情
    this.getInvestDetail = function(obj) {
      return $http.post(APISERVER.MSAPI + '/directInvestment/getInvestDetail', {
        sessionId: user.sessionId,
        boId: obj.boId
      });
    };

    // 投资记录-诺诺盈-投资详情
    // this.getInvestRecordDetail = function(obj) {
    //   return $http.post(APISERVER.MSAPI + '/directInvestment/getInvestRecordDetail', {
    //     sessionId: user.sessionId,
    //     boId: obj.boId
    //   });
    // };
    this.getAcceptRecord = function(obj) {
      return $http.post(APISERVER.MSAPI + '/directInvestment/getAcceptRecord', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage,
        boId: obj.boId
      }, {
        silence: obj.pageIndex
      });
    };

    // 投资记录-债转类
    this.getDebtInvest = function(obj) {
      return $http.post(APISERVER.MSAPI + '/debt/getDebtInvest', {
        sessionId: user.sessionId,
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    // 债转
    this.getDebtProtol = function(obj) {
      return base('/debt/debtTransferAgreement', {
        dblId: obj.id,
        sessionId: user.sessionId
      });
    };


    this.getDebtList = function(obj) {
      return base('/debt/getDebtList', {
        pageNo: obj.pageIndex,
        pageSize: obj.itemsPerPage,
        type: obj.debtType,
        sortBy: obj.sortType,
        sortAsc: obj.sortAsc
      }, {
        silence: obj.pageIndex
      });
    }

    // 月月升
    this.getPlan = function(obj) {
      return base('/stagePlan/getPlan', {
        sessionId: user.sessionId
      });
    }

    this.getMonthUpProtol = function(obj) {
      return base('/stagePlan/stagePlanInvestAgreement', {
        fpId: obj.id,
        sessionId: user.sessionId
      });
    };
    // this.quitPlan = function(obj) {
    //   return base('/stagePlan/stagePlanInvestAgreement', {
    //     vaId: obj.id
    //   });
    // }

    this.quitPlan = function(obj) {
      return base('/stagePlan/quitPlan', {
        vaId: obj.id,
        sessionId: user.sessionId
      });
    }


    // 诺诺盈
    this.getNxyProtol = function(obj) {
      return base('/directInvestment/directInvtAgreement', {
        sessionId: user.sessionId,
        boId: obj.id
      });
    };
    // 回款计划
    this.getRepayPlanForMonth = function(obj) {
      return base('/repayment/repaymentPlanForMonth', {
        start_month: obj.data,
        sessionId: user.sessionId
      });
    };

    this.getRepayListInfo = function(obj) {
      return base('/repayment/repaymentPlanDetails', {
        pageNum: obj.pageIndex,
        sessionId: user.sessionId
      });
    };

    //列表
    this.getProductIndexList = function(obj) {
      return base('/licai/getProductIndexList', {
        sessionId: user.sessionId,
        productType: obj.productType,
        pageSize: obj.pageSize,
        pageNo: obj.pageNo,
        min_expect: obj.min_expect,
        max_expect: obj.max_expect,
        type: obj.type
      }, {
        silence: obj.pageNo
      });
    }

    //计划类
    this.getFinanceProductDetails = function(obj) {
      return base('/licai/getFinanceProductDetails', {
        sessionId: user.sessionId,
        pro_id: obj.proId,
        scope: obj.scope
      });
    };

    this.getFinanceProductInfo = function(obj) {
      return base('/licai/getFinanceProductInfo', {
        sessionId: user.sessionId,
        fid: obj.fid,
        scope: obj.scope
      });
    };

    //直投(诺诺盈)
    this.getProductDetail = function(obj) {
      return base('/directInvestment/getProductDetail', {
        sessionId: user.sessionId,
        id: obj.proId
      });
    };

    this.getDirectProductInfo = function(obj) {
      return base('/directInvestment/directProductInfo', {
        bid: obj.bid
      });
    };

    this.getBorrower = function(obj) {
      return base('/directInvestment/getBorrower', {
        id: obj.id
      });
    };

    //债转
    this.getDebtDetail = function(obj) {
      return base('/debt/getDebtDetail', {
        id: obj.id
      });
    };

    this.getDebtBorrowDetail = function(obj) {
      return base('/debt/getDebtBorrowDetail', {
        id: obj.id
      });
    };

    this.getDebtBuyLogs = function(obj) {
      return base('/debt/getDebtBuyLogs', {
        id: obj.id,
        pageSize: obj.itemsPerPage,
        pageNo: obj.pageNo,
        type: obj.type
      }, {
        silence: obj.itemsPerPage
      });
    };

    this.getDebtRepayLogs = function(obj) {
      return base('/debt/getDebtRepayLogs', {
        id: obj.id,
        pageSize: obj.itemsPerPage,
        pageNo: obj.pageNo,
      }, {
        silence: obj.itemsPerPage
      });
    };
    //我的债权
    this.getmyDebtDebtList = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/debtList', {
        params: {
          type: 0,
          pi: obj.pageNo,
          ps: obj.itemsPerPage
        }
      });
    };

    this.getmyDebtTransferList = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/myDebtTransferRecords', {
        params: {
          to: 0,
          os: 0,
          pi: obj.pageNo,
          ps: obj.itemsPerPage
        }
      });
    };

    this.getmyDebtTransferDetail = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/debtSaleTransDetails', {
        params: {
          type: obj.type,
          id: obj.id
        }
      });
    };

    this.getsoldOut = function(obj) {
      return $http.get(APISERVER.FESERVER + '/prod/prdOffShelf', {
        params: {
          productId: obj.id,
          productType: 10
        }
      });
    };

    this.getTransferDetail = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/transferDetail', {
        params: {
          deaId: obj.id
        }
      });
    };

    this.getSaleDebtBatchList = function(obj) {
      return $http.get(APISERVER.FESERVER + '/invt/transferableDebts', { params: { vaId: obj.id } });
    };

    //单笔上架
    this.upShelfForOneDebtSale = function(obj) {
      return $http.get(APISERVER.FESERVER + '/prod/upShelfForOneDebtSale', {
        params: {
          deaId: obj.deaId,
          title: obj.title,
          tr: obj.tr
        }
      });
    };

    //批量上架
    this.upBatchDebtSale = function(obj) {
      return $http.get(APISERVER.FESERVER + '/prod/upBatchDebtSale', {
        params: {
          deaIds: obj.deaIds,
          vaId: obj.vaId,
          title: obj.title,
          tr: obj.tr
        }
      });
    };

    //三重保障接口
    this.multipleProtectPlan = function(obj) {
      return base('/app/multipleProtectPlan', {

      });
    };

    function base(path, data, config) {
      return $http.post(APISERVER.MSAPI + path, data, config);
    }

    $log.debug('UserApi end');

  }
})();
