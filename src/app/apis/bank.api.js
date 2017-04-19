(function() {
  'use strict';

  angular
    .module('nonoApp')
    .service('BankApi', BankApi);

  /** @ngInject */
  function BankApi($http, $log, APISERVER, user) {

    this.withdrawHistory = function(obj) {
      return base('/bank/withdrawlist', {
        sessionId: user.sessionId,
        pageNumber: obj.pageIndex,
        pageSize: obj.itemsPerPage
      }, {
        silence: obj.pageIndex
      });
    };

    function base(path, data, config) {
      return $http.post(APISERVER.MSAPI + path, data, config);
    }

    $log.debug('BankApi end');

  }
})();
