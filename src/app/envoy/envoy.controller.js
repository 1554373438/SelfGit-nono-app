(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('EnvoyController', EnvoyController);

  /** @ngInject */
  function EnvoyController($rootScope, UserApi, BasicApi, ActivityApi, BridgeService, AppService, $location, $state, user, $log, HOST) {
    var vm = this;

    vm.info = {};
    vm.goRewardDetail = goRewardDetail;
    vm.goMyBonus = goMyBonus;
    vm.invite = invite;
    vm.getMore = getMore;

    // init envoy info
    init();

    function init() {
      vm.info.haveRedPacket = false;
      BasicApi.getEnvoyInfo().success(function(res) {
        if (res.flag == 1) {
          vm.info.earnings = +res.data.pay;
        }
      });

      getCashPacket();
    }

    function getCashPacket() {
      ActivityApi.getCashPacket().success(function(res) {
        if (res.succeed) {
          vm.info.haveRedPacket = res.data.haveRedPacket;
          vm.info.redPacket = res.data.newestCashPacket;
          if (vm.info.redPacket) {
            vm.info.shareBalance = vm.info.redPacket.remainingBalance;
            if(vm.info.redPacket.invalid) {
              vm.info.shareBalance = 0;
            }
          }
        }
      });
    }

    function goRewardDetail() {
      _czc.push(['_trackEvent', '镑客大使', '点击', '累计奖励详情']);
      $state.go('envoy:reward');

    }

    function goMyBonus() {
      _czc.push(['_trackEvent', '镑客大使', '点击', '查看加息券']);
      if (BridgeService.bridge) {
        BridgeService.send({
          type: 'pageSwitch',
          data: {
            name: 'bonus',
            tab: 'jiaxi' //tab参数：现金券：'cash'，加息券：'jiaxi'，诺币：'nb'
          }
        });
      } else {
        $state.go('welfare', { index: 1 });
      }

    }

    function getMore() {
      // _czc.push(['_trackEvent', '镑客大使', '点击', '了解更多']);
      $state.go('envoy:rules');
    }

    function invite() {
      _czc.push(['_trackEvent', '镑客大使', '分享', '邀请好友']);
      var host = /nonobank.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST;
      UserApi.getBasicInfo().success(function(res) {
        if (res.succeed) {
          var mobile = res.data.mobile;
          var regTime = new Date(res.data.registerTime && res.data.registerTime.replace(/\-/g, '/'));
          var day = parseInt((new Date() - regTime) / (1000 * 60 * 60 * 24));
          var timestamp = (new Date()).getTime();
          var shareUrl = host + '/nono/envoy-land-page/index.html?mobile=' + mobile + '&regtime=' + day + '&balance=' + vm.info.shareBalance+'&timestamp='+timestamp;
          var shareIconPath = $location.absUrl().split('#')[0] + 'assets/images/envoy/share_icon.png';
          share(shareUrl, shareIconPath);

        } else {
          var shareUrl = 'https://m.nonobank.com/nono/outreg/outreg.html';
          var shareIconPath = $location.absUrl().split('#')[0] + 'assets/images/envoy/share_icon.png';
          share(shareUrl, shareIconPath);
        }
      });

    }

    function share(shareUrl, iconPath) {
      if (!BridgeService.bridge) {
        window.location.href = shareUrl;
        return;
      }
      var title = '', desc = '', sms = '', expired = true;

      if (vm.info.haveRedPacket && +vm.info.shareBalance) {
        title = '我已领取41800特权本金，邀您一起来瓜分';
        desc = '庆B轮融资，注册即送668元现金券';
        sms = '我已在诺诺领取41800特权本金，邀您一起来瓜分，并可专享历史年化12%收益，一起来赚钱请戳' + shareUrl;
      } else {
        title = '我已加入诺诺，特邀您领取668元现金券';
        desc = '庆B轮融资，新客专享历史年化12%利率等您哦';
        sms = '庆B轮融资，新客专享历史年化12%收益，还可领取668元现金券，一起来赚钱请戳' + shareUrl;
      }

      BridgeService.send({
        type: 'share',
        data: {
          share_title: title,
          share_desc: desc,
          share_url: shareUrl,
          share_icon: iconPath,
          share_type: 2, //1 普通分享 2 二维码
          share_sms: sms
        }
      });
    }



  }
})();
