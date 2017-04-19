(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('DiscoverController', DiscoverController);

  /** @ngInject */
  function DiscoverController(BasicApi, $scope, $state, $rootScope) {
    var vm = this;
    vm.gotoBBSLogin = gotoBBSLogin;

    function gotoBBSLogin() {
      BasicApi.goBBSLogin().success(function(res) {
        if (res.flag == 1) {
          var bbs_login_address = res.data.bbs_login_address;
          if (!bbs_login_address) {
            window.location.href = 'https://bbs.nonobank.com';
            return;
          }
          var BBS_login_address = bbs_login_address.replace("http", "https");
          loadScript(BBS_login_address, function() {
            window.location.href = 'https://bbs.nonobank.com';
          });
        }
      });
    }

    function loadScript(src, callback) {
      var script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0];
      script.type = 'text/javascript';
      script.charset = 'UTF-8';
      script.src = src;
      if (script.addEventListener) {
        script.addEventListener('load', function() {
          callback();
        }, false);
      } else if (script.attachEvent) {
        script.attachEvent('onreadystatechange', function() {
          var target = window.event.srcElement;
          if (target.readyState == 'loaded') {
            callback();
          }
        });
      }
      head.appendChild(script);
    }
  }
})();
