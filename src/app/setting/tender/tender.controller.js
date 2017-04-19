
(function() {
  'use strict';

  angular
    .module('nonoApp')
    .controller('tenderController', tenderController);

  /** @ngInject */
  function tenderController($stateParams, EbankService) {
    var vm = this;

    vm.complete = complete;

    function complete (){
      EbankService.goPage('pwd/enter.html?flag=' + $stateParams.type);
    }

  }
})();