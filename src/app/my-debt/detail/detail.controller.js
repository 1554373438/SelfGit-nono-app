(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('detailController', detailController);

  /** @ngInject */
  function detailController($rootScope, localStorageService, toastr, utils, $state, $stateParams, BasicApi) {
    var vm = this;

    vm.reason = '';

    vm.discount = '';

    vm.submit = submit;

    vm.isFlag = false;

    vm.discountBlur = discountBlur;

    vm.goBack = goBack;

    vm.type = $stateParams.type;

    vm.pick = localStorageService.get('pick');

    vm.debtPick = localStorageService.get('debtPick');

    if (vm.type == 0) {
      getTransferDetail();
    } else {
      init();
    }

    function getTransferDetail() {
      BasicApi.getTransferDetail({
        id: $stateParams.id
      }).success(function(res) {
        if (res.succeed) {
          vm.info = res.data;
        }
      })
    }

    function goBack() {

      $state.go('debt:protocol', { id: vm.info.id });

    }

    function trim(str) {　　
      return str.replace(/(^\s*)|(\s*$)/g, "");　　
    }

    function discountBlur() {
      if (vm.discount == '' || vm.discount == null || vm.discount.leng == 0) {
        vm.isFlag = false;
        toastr.info('折扣范围不可为空');
        return;
      }

      if(!/^\d+$/.test(vm.discount)){
        vm.isFlag = false;
        toastr.info('请输入90～100的整数');
        return;
      }

      if (+vm.discount < 90 || +vm.discount > 100) {
        vm.isFlag = false;
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': '折扣范围90～100',
          'okText': '确定'
        });
        vm.discount = '';
        return;
      }
      vm.isFlag = true;

      /**
       * 受让人历史年化收益率 = 购买人未收利息 + (原始本金 * (1 - 转让折扣 / 100))
       * 转让总价 = 原始本金 * 转让折扣
       * 受让人预期收益 = 购买人预期收益 / 购买金额(出售金额) / 剩余期限（月） * 12 * 100%
       * 转让手续费 = 出售金额 * 0.005
       * @param 受让人历史年化收益率 : anAnnual
       * @param 转让总价 : amount
       * @param 受让人预期收益 : earnings
       * @param 转让手续费 poundage
       * @param 类型 : type 0 单笔 1批量
       */
      if (vm.type == 0) {
        vm.earnings = +vm.info.remainInterest + (+vm.info.remainPrincipal * (1 - +vm.discount / 100));
        vm.amount = +vm.info.remainPrincipal * (+vm.discount / 100);
        vm.anAnnual = +vm.earnings / +vm.amount / +vm.info.remainExpect * 12 * 100;
        vm.poundage = +vm.amount * 0.005;
      } else {
        var sum = 0;
        var arr = [];
        var temp = 0;
        for (var i = 0; i < vm.pick.picKlist.length; i++) {
          sum = sum + (+vm.pick.picKlist[i].unPaidFee + (+vm.pick.picKlist[i].unPaidPrice * (1 - +vm.discount / 100)));
          temp = (+vm.pick.picKlist[i].unPaidFee + (+vm.pick.picKlist[i].unPaidPrice * (1 - +vm.discount / 100)));
          arr.push(temp / (+vm.pick.picKlist[i].unPaidPrice * (+vm.discount / 100)) / +vm.pick.picKlist[i].remainExpect * 12 * 100);
        }
        vm.earnings = sum;
        vm.amount = +vm.pick.pickSum * (+vm.discount / 100);
        vm.min = Math.min.apply(null, arr);
        vm.max = Math.max.apply(null, arr);
        vm.poundage = +vm.amount * 0.005;
      }

    }

    function init() {
      var arr = [];
      for (var i = 0; i < vm.pick.picKlist.length; i++) {
        arr.push(+vm.pick.picKlist[i].unPaidFee / +vm.pick.picKlist[i].unPaidPrice / +vm.pick.picKlist[i].remainExpect * 12 * 100);
      }
      vm.rateMinShow = Math.min.apply(null, arr).toFixed(2);
      vm.rateMaxShow = Math.max.apply(null, arr).toFixed(2);
    }

    function submit() {
      if (trim(vm.reason).length == 0) {
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': '债转理由不可为空',
          'okText': '确定'
        });
        return;
      }
      if (trim(vm.reason).length > 10) {
        toastr.info('不可超过10个字');
        vm.reason = '';
        return;
      }
      if (trim(vm.reason).length > 10) {
        toastr.info('不可超过10个字');
        vm.reason = '';
        return;
      }
      if (vm.discount == '' || vm.discount == null || vm.discount.leng == 0) {
        toastr.info('折扣范围不可为空');
        return;
      }

      if(!/^\d+$/.test(vm.discount)){
        toastr.info('请输入90～100的整数');
        return;
      }

      if (+vm.discount < 90 || +vm.discount > 100) {
        utils.alert({
          'title': '提示',
          'cssClass': '',
          'content': '折扣范围90～100',
          'okText': '确定'
        });
        vm.discount = '';
        return;
      }
      setTimeout(function() {
        utils.alert({
          'title': '请确认转让金额',
          'cssClass': 'mydebt-prompt',
          'content': '<p class="space-between"><span>转让总价格</span><span class="brown">' + (vm.amount).toFixed(2) + '元</span></p><p class="space-between"><span>转让手续费</span><span class="brown">' + (vm.poundage).toFixed(2) + '元</span></p>',
          'okText': '确定',
          onOk: function() {
            if (+vm.type == 0) {
              BasicApi.upShelfForOneDebtSale({
                deaId: $stateParams.id,
                title: vm.reason,
                tr: vm.discount
              }).success(function(res) {
                if (res.succeed) {
                  toastr.info(res.errorMessage);
                  $state.go('myDebt:list');
                } else {
                  toastr.info(res.errorMessage);
                }
              });
            } else {
              BasicApi.upBatchDebtSale({
                deaIds: vm.pick.deaIds,
                vaId: vm.debtPick.vaid,
                title: vm.reason,
                tr: vm.discount
              }).success(function(res) {
                if (res.succeed) {
                  toastr.info(res.errorMessage);
                  $state.go('myDebt:list');
                } else {
                  toastr.info(res.errorMessage);
                }
              })
            }
          }
        });
      }, 1);

    }

  }
})();
