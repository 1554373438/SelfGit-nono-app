(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('MineController', MineController);

  /** @ngInject */
  function MineController($state, TrdApi, $rootScope, $scope, utils, user, UserService, EbankService, AccApi) {
    var vm = this, submitSwitch = false;
    vm.user = user;
    vm.pageList = [
      { state: 'repay', name: '回款计划', icon: 'wallet' },
      { state: 'records:list', name: '投资记录', icon: 'pig' },
      { state: 'welfare', name: '我的福利', icon: 'gift' },
      { state: 'myDebt:list', name: '我的债权', icon: 'more' },
      { state: 'card', name: '银行卡管理', icon: 'bcard' },
    ];
    vm.goTo = goTo;
    vm.goTopup = goTopup;
    vm.goWithdraw = goWithdraw;

    init();


    function init() {
      vm.account = UserService.getAccountInfo();
      // reload data for every entrance
      $scope.$on("$ionicView.beforeEnter", UserService.updateAssetsInfo);
      $rootScope.$on('updateAssetsInfo.complete', function() {
         vm.account = UserService.getAccountInfo();
      });
    }


    function goTo(stateName, params) {
      if(stateName == 'card') {
        EbankService.goPage('entrance');
      } else {
        stateName && $state.go(stateName, params);
      }

    }

    function goTopup() {
      if (!user.hasEBank) {
        EbankService.showPopup('充值');
        return;
      }

      $state.go('topup');
    }

    function goWithdraw() {
      if (!user.hasEBank ) {
        EbankService.showPopup('提现');
      }else if(!user.isAuth){
        utils.confirm({
          title: '提示',
            content: '您暂未绑定提现银行卡，如您不添加新银行卡将无法提取徽商银行电子账户余额',
            cssClass:'captcha-pop-1',
            onOk: function () {
              EbankService.goPage('entrance');
          },
        });
      }else{
        TrdApi.getWithdrawStatus().success(function (res) {
          if (!res.succeed) {
            toastr.info(res.errorMessage);
            return;
          }
          if (res.data) {
            /* 0--可申请提现进入提现页面（无审核或审核拒绝）；1--审核中；2--审核通过（直接调审核通过的提现接口）*/
            if (res.data.status == 1) {
              utils.alert({
                title: '提示',
                subTitle: res.data.reason
              });
              return;
            }
            if (res.data.status == 2) {
              utils.confirm({
                title: '提示',
                content: content(res.data),
                cssClass: 'captcha-pop-1',
                onOk: function () {
                  goCheckCash(res.data);
                },
              });
              return;
            }
          }
          $state.go('withdraw');
        });
      }
    }

    function content(data) {
      return '<p class="text-center"><span>审批金额：' + data.amount + '元</span><br><span>手续费：' + data.fee + '元</span><br><span>实际到账金额: ' + data.arrivalAmount + '元</span></p>';
    }

    function goCheckCash(data) {
      if (submitSwitch) return;
      if (!submitSwitch) {
        TrdApi.withdrawCheckSubmit(data).success(function(res) {
          submitSwitch = false;
          if (!res.succeed) {
            utils.alert({
              title: '提示',
              subTitle: res.errorMessage
            });
            return;
          }
          if (res.data) {
            EbankService.formPost(res.data.targetUrl, res.data.formData);
          }
        }).error(function() {
          submitSwitch = false;
        });

      }
    }




  }
})();
