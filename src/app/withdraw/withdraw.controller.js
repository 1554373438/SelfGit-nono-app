(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('WithdrawController', WithdrawController);

  /** @ngInject */
  function WithdrawController($scope, TrdApi, HOST, localStorageService, EbankService, user, toastr, utils) {
    var vm = this,
      submitSwitch = false;
      // lineObj = {};

    vm.submit = submit;
    vm.showPop = showPop;
    vm.info = {};

    vm.getUserLevel = user.level;

    $scope.$on('$ionicView.beforeEnter', init);
    init();

    function init() {
      TrdApi.getWithdrawInfo().success(function(res) {
        if (!res.succeed) {
          toastr.info(res.errorMessage);
          return;
        }
        vm.info = res.data;
        vm.info.bankTail = vm.info.bankCardNo && vm.info.bankCardNo.slice(-4);
        vm.info.fee = 0;


      })
    }


    $scope.$watch(function() {
      return vm.info.amount;
    }, function(val, old) {
      if (val != old) {
        if (val > vm.info.nonoAvlBalance) {
          vm.info.amount = vm.info.nonoAvlBalance;
        }

        if ( !vm.info.isNonFee) {
          getFee(+val);
        }
      }
    }, true);


    // 计算提现手续费
    function getFee(amount) { //体现金额
      vm.info.fee = 0;
      if (amount > 0 && amount < 20000) {
        vm.info.fee = 2;
      } else if (20000 <= amount && amount < 50000) {
        vm.info.fee = 3;
      } else {
        var num_fee = Math.floor(amount / 49999); //计算提现金额可以拆分为几个49999
        var remainder = amount - num_fee * 49999; //计算余额：用提现金额除以49999
        var a_fee = num_fee * 3;
        var re_fee = 0;
        if (0 < remainder && remainder < 20000) {
          re_fee = 1;
        } else if (remainder >= 20000) {
          re_fee = 3;
        }
        vm.info.fee = a_fee + re_fee;
        return;
      }
    }

    function submit() {
      if (!vm.info.amount) {
        utils.alert({
          title: '提示',
          subTitle: '请输入有效提现金额'
        });
        return;
      }
      if (vm.info.amount > vm.info.nonoAvlBalance) {
        utils.alert({
          title: '提示',
          subTitle: '提现超过账户余额'
        });
        return;
      }
      if (vm.info.amount < 2) {
        utils.alert({
          title: '提示',
          subTitle: '可提现金额小于3.00元，无法提现'
        });
        return;
      }
      if (vm.info.amount >= vm.info.largeAmount && !vm.info.lineNo) {
        utils.alert({
          title: '提示',
          subTitle: '请输入联行号'
        });
        return;
      }

      var obj = {
        amount: vm.info.amount,
        lineNo: vm.info.lineNo,
        isNonFee: vm.useFree ? true : false,
        surl: HOST + '/#/withdraw/success',
        purl: HOST + '/#/withdraw',
        needRedis: false
      };
      if (submitSwitch) return;
      if (!submitSwitch) {
        submitSwitch = true;

        TrdApi.withdrawApply(obj).success(function(res) {
          submitSwitch = false;
          ajaxHandler(res);
        }).error(function () {
          submitSwitch = false;
        });

      }
    }

    function ajaxHandler(option) {
      if(!option.succeed){
        toastr.info(option.errorMessage);
        return;
      }
      if(option.data.status !== 1){
        utils.alert({
          title: '提示',
          subTitle: option.data.desc,
        });
        return;
      }
      if(option.data){
        EbankService.formPOST(option.data.targetUrl, option.data.formData);
      }
    }

    function showPop() {
      utils.alert({
        title: '什么是电子联行号',
        subTitle: '<p class="text-center"  style="line-height:18px;">银行联行号就是一个地区银行的唯一识别标志。用于人民银行所组织的大额支付系统\小额支付系统\城市商业银行银行汇票系统\全国支票影像系统(含一些城市的同城票据自动清分系统)等跨区域支付结算业务。由12位组成：3位银行代码+4位城市代码+4位银行编号+1位校验位。</p>',
        cssClass: 'captcha-pop-1'
      });
    }

    // function seeFee() {
    //   $state.go('withdraw:fee');
    //   // utils.alert({
    //   //   subTitle: '<p class="text-center">2万元以下： 2元／笔<br/>2万(含)－5万： 3元／笔<br/>5万(以上)：系统自动拆分</p>',
    //   //   title: '手续费说明',
    //   //   cssClass: 'captcha-pop-1'
    //   // });
    //
    // }
  }

})();
