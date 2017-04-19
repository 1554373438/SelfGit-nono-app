(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('EbankService', EbankService);

  /** @ngInject */
  function EbankService($location, HOST, user, utils, $log, AccApi) {
    var self = this;
    $log.debug('EbankService.init');

    self.showPopup = function(text) {
       utils.confirm({
        title: '徽商存管开户提醒',
        content: '<p>诺诺镑客已接入徽商存管，如需'+text+'，请先开通银行存管。</p>',
        cssClass: 'popup-eBank text-left',
        okText: '立即开通徽商存管',
        okType: 'button-positive button-clear',
        cancelText: '先去逛逛',
        cancelType: 'button-positive button-clear',
        onOk: function() {
          self.goPage('entrance');
        }
      });
    };

    self.goPage = function(page) {
      var host = $location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : '');
      var hscgHost = '';
      if(/nonobank.com/.test($location.host())) {
        var curUrl = encodeURIComponent(host + '/nono-app/#'+$location.path());
        hscgHost = host + '/hscg/';
      } else {
        var curUrl = encodeURIComponent(host + '/#'+$location.path());
        hscgHost = 'http://localhost:3004/';
       
      }
    
      if (page.indexOf('?') != -1) {
        var link = hscgHost + page + '&sessionId=' + user.sessionId + '&terminal=3&version=5.2.0&urlCallBack=' + curUrl;
      } else {
        if (page.indexOf('.html') > -1) {
          var link = hscgHost + page + '?sessionId=' + user.sessionId + '&terminal=3&version=5.2.0&urlCallBack=' + curUrl;
        } else {
          var link = hscgHost + page + '/index.html?sessionId=' + user.sessionId + '&terminal=3&version=5.2.0&urlCallBack=' + curUrl;
        }
      }
      window.location.href = link;
    };

    self.formPOST = function(url, data, options) {
      var form = document.createElement('form');
      form.style.opacity = 0;
      form.action = url;
      form.method = 'post';

      for (var key in data) {
        var input = document.createElement('input');
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    }

  }
})();
