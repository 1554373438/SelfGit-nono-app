(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('RecordsDetailController', RecordsDetailController);

  /** @ngInject */
  function RecordsDetailController(localStorageService, BasicApi, toastr, utils, $state, AgreementService, $log) {
    var vm = this,
      finishDay, moreEarning;
    vm.quitConfirm = quitConfirm;
    vm.borProtocol = borProtocol;
    vm.directProDetail = directProDetail;
    vm.showProtocol = showProtocol;

    init();

    function init() {
      vm.info = localStorageService.get('record');
      $log.debug(vm.info);
      if (vm.info.name == '诺诺盈') {
        var bId = vm.info.bId;
        BasicApi.getInvestDetail({
          boId: bId
        }).success(function(res) {
          if (res.flag === 1) {
            vm.directDetail = res.data;
          }
        });
        return;
      }

      //月月升
      finishDay = vm.info.finishDayLeft;
      moreEarning = vm.info.moreEarning;

    }


    function quitConfirm() {
      utils.confirm({
        title: '提示',
        content: '<p>还剩<span>' + finishDay + '天，</span>到期收益可以多拿<span class="assertive">' + moreEarning + '</span>元，确定此时提前退出吗？<span ng-if="vm.info.name == 月月升">申请退出后，平均2~5个工作日到账户余额</span></p>',
        cssClass: 'record-popup',
        okText: '提前退出',
        okType: 'button-positive',
        cancelText: '取消',
        cancelType: 'button-positive',
        onOk: function() {
          BasicApi.quitPlan({ id: vm.info.fp_id }).success(function(res) {
            if (res.flag == 1) {
              toastr.info(res.msg);
            }
            vm.info.status = res.data.status;
          });
        }
      });
    }

    function directProDetail() {
      //诺诺盈产品信息
      $state.go('directInvest:detail', { id: vm.info.bId });
    }

    function borProtocol() {
      //诺诺盈借款协议
      $state.go('nny:protocol', { id: vm.info.bId });
    }

    function showProtocol() {
      var params = {};
      if(vm.info.type == 1 || vm.info.type ==2 || vm.info.type == 8) {
        params.fpId = vm.info.fp_id;
      } else if(vm.info.type == 6) {
        params.dblId = vm.info.bo_id;
      } else {
        params.boId = vm.info.id;
      }
      AgreementService.getAgreementInvest(params);
    }

  }
})();
