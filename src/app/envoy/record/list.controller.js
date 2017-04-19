(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('EnvoyRecordController', EnvoyRecordController);

  /** @ngInject */
  function EnvoyRecordController($stateParams, $location, ActivityApi, UserApi, BridgeService, HOST) {
    var vm = this, balance = 0, invalid, haveRedPacket;
    vm.list = [];
    vm.invite = invite;

    init();

    function init() {
      haveRedPacket = $stateParams.haveRedPacket=='true'?true:false;
      balance = $stateParams.balance;
      if(+invalid) {
        balance = 0;
      }
      getList();
    }

    function getList() {
      ActivityApi.receiveRecords().success(function(res) {
        if (res.succeed) {
          vm.list = res.data && res.data.results;
        }
      });
    }

    function invite() {
    
      _czc.push(['_trackEvent', '镑客大使-领取记录', '点击', '邀请好友']);
      UserApi.getBasicInfo().success(function(res) {
        if (res.succeed) {
          var mobile = res.data.mobile;
          var regTime = new Date(res.data.registerTime && res.data.registerTime.replace(/\-/g, '/'));
          var day = parseInt((new Date() - regTime) / (1000 * 60 * 60 * 24));
          var host = /nonobank.com/.test($location.host()) ? $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '') : HOST;
          var timestamp = (new Date()).getTime();
          var shareUrl = host+'/nono/envoy-land-page/index.html?mobile=' + mobile + '&regtime=' + day + '&balance=' + balance+'timestamp='+timestamp;
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
      var title = '', desc = '', sms = '';

      if (haveRedPacket && +balance) {
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
