(function(){
  'use strict';

  angular
    .module('nonoApp')
    .controller('HscgController', HscgController);

  /** @ngInject */
  function HscgController($stateParams, utils, UserService, localStorageService) {
    var vm = this;

    vm.link = $stateParams.link;

    window.addEventListener('message', function(evt) {
      var data = evt.data;
      // TODO: handle hscg callback here
      console.log(evt.data);
      var msg  = data && data.data;

      if(msg.step) {
        switch(msg.step) {
          case 'bindCard'://绑卡
          case 'setPwd': //设置密码
          case 'withDraw': // 提现
          case 'autoInvest': //自动投标
          case 'autoDebt'://自动债转
          case 'delectCard': //删除银行卡
            localStorageService.remove('userLineInfo');//删除银行卡后清除联行号信息
            break;
          case 'resetMobile': //修改手机号
            utils.goBack();
            break;
          case 'pay': //投资购买
            // 购买成功 失败后跳转页面
            break;

        }
      }

    }, false);

  }
})();
