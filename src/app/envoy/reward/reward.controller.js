(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('EnvoyRewardController', EnvoyRewardController);

  /** @ngInject */
  function EnvoyRewardController(utils, UserApi, BasicApi, BridgeService, $location, $state) {
    var vm = this;

    vm.showAlert = showAlert;

    init();

    function init() {
      BasicApi.getEnvoyRewardInfo().success(function(res) {
        if(res.flag === 1) {
          vm.info = res.data;
          vm.info.lastMonth = +vm.info.currentMonth - 1 || 12;
        }
      });
    }

    function showAlert() {
      utils.alert({
        'title':'什么是预期结算金额？',
        'cssClass':'new-popup-container',
        'content':'<b>预期待结算金额：</b><p>根据 "当前好友持有的本金" 计算的奖励金额。</p><b>实际结算金额：</b><p>根据“结算时好友持有的本金”计算的奖励金额。<br />在产品持有期间，如果好友提前转让/退 出产品，即好友持有的本金减少，实际结算奖励将相应地减少。</p>',
        'okText':'知道了'
      });
    }
  };
})();
