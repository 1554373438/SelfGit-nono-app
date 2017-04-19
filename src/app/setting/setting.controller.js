(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('SettingController', SettingController);

  /** @ngInject */
  function SettingController($scope, UserService, EbankService, $state, utils, user) {
    var vm = this;

    vm.info = user;

    // methods
    vm.jumpSw = jumpSw;
    vm.goHscg = goHscg;
    vm.logout = logout;

    $scope.$on('$ionicView.beforeEnter', function() {
      UserService.updateEbankInfo();
    });

    function logout() {
      utils.confirm({
        content: '<p>确认安全退出吗？</p>',
        okType: 'button',
        cssClass: 'captcha-pop-1',
        onOk: UserService.logout
      });
    }

    function jumpSw() {
      if (vm.info.investAuth) return;
      EbankService.goPage('autoInvest/index.html?firstPage=1');
      // $state.go('tender', { type: vm.info.hasSign4Bid ? 'autoDebt' : 'autoInvest'});
    }

    function goHscg() {
      EbankService.goPage('entrance');
    }
  }
})();
